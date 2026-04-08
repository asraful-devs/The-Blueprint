import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import type { Request } from 'express';
import status from 'http-status-codes';
import { prisma } from '../../../../lib/prisma';
import config from '../../config';
import ApiError from '../../error/ApiError';
import welcomeTemplate from '../../templates/email/welcomeTemplate';
import nodemailerEmailSender from '../../utils/nodemailer.config';

const createUser = async (req: Request) => {
    const payload = req.body;
    const transactionId = randomUUID();

    const result = await prisma.$transaction(async (tx) => {
        //isExisting user check logic here
        const isExisting = await tx.user.findUnique({
            where: {
                email: payload.email,
            },
        });

        if (isExisting) {
            throw new ApiError(status.CONFLICT, 'User already exists !');
        }

        //password hashing
        const hashPassword = await bcrypt.hash(
            payload.password,
            config.bcrypt_salt_rounds
        );

        //create user logic here
        const createdUser = await tx.user.create({
            data: {
                ...payload,
                password: hashPassword,
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
            },
        });

        const emailInfo = await nodemailerEmailSender(
            createdUser.email,
            'Welcome to The Blueprint',
            welcomeTemplate(createdUser.fullName, transactionId)
        );

        if (!emailInfo.messageId) {
            throw new ApiError(
                status.INTERNAL_SERVER_ERROR,
                'Failed to send welcome email !'
            );
        }

        return {
            ...createdUser,
            transactionId,
            emailTransactionId: emailInfo.messageId,
        };
    });

    return result;
};

const getAllUsers = async () => {
    const result = await prisma.user.findMany({
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
        },
        orderBy: {
            id: 'desc',
        },
    });

    return result;
};

const getSingleUser = async (req: Request) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        throw new ApiError(status.BAD_REQUEST, 'Invalid user id !');
    }

    const result = await prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
        },
    });

    if (!result) {
        throw new ApiError(status.NOT_FOUND, 'User not found !');
    }

    return result;
};

const updateUser = async (req: Request) => {
    const id = Number(req.params.id);
    const payload = req.body;

    if (Number.isNaN(id)) {
        throw new ApiError(status.BAD_REQUEST, 'Invalid user id !');
    }

    const isExisting = await prisma.user.findUnique({
        where: {
            id,
        },
    });

    if (!isExisting) {
        throw new ApiError(status.NOT_FOUND, 'User not found !');
    }

    if (payload.email && payload.email !== isExisting.email) {
        const existingByEmail = await prisma.user.findUnique({
            where: {
                email: payload.email,
            },
        });

        if (existingByEmail) {
            throw new ApiError(status.CONFLICT, 'Email already exists !');
        }
    }

    if (payload.password) {
        payload.password = await bcrypt.hash(
            payload.password,
            config.bcrypt_salt_rounds
        );
    }

    const result = await prisma.user.update({
        where: {
            id,
        },
        data: payload,
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
        },
    });

    return result;
};

const deleteUser = async (req: Request) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        throw new ApiError(status.BAD_REQUEST, 'Invalid user id !');
    }

    const isExisting = await prisma.user.findUnique({
        where: {
            id,
        },
    });

    if (!isExisting) {
        throw new ApiError(status.NOT_FOUND, 'User not found !');
    }

    const result = await prisma.user.delete({
        where: {
            id,
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
        },
    });

    return result;
};

export const UserService = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
};
