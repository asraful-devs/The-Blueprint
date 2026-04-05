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

export const UserService = {
    createUser,
};
