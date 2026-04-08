import bcrypt from 'bcryptjs';
import type { Request } from 'express';
import status from 'http-status-codes';
import { prisma } from '../../../../lib/prisma';
import config from '../../config';
import ApiError from '../../error/ApiError';

const createUser = async (req: Request) => {
    const payload = req.body;

    //password hashing
    const hashPassword = await bcrypt.hash(
        payload.password,
        config.bcrypt_salt_rounds
    );

    //isExisting user check logic here
    const isExisting = await prisma.user.findUnique({
        where: {
            email: payload.email,
        },
    });

    if (isExisting) {
        throw new ApiError(status.CONFLICT, 'User already exists !');
    }

    //create user logic here
    const result = await prisma.user.create({
        data: {
            ...payload,
            password: hashPassword,
        },
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
