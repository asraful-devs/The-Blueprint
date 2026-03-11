import bcryptjs from 'bcryptjs';
import httpStatus from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../../config/env.js';
import ApiError from '../../error/ApiError.js';
import { IUser, Role } from './user.interface.js';
import { User } from './user.model.js';

// create a user service that handles user-related operations
const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;
    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User Already Exist...');
    }

    const hashedPassword = await bcryptjs.hash(
        password as string,
        Number(envVars.BCRYPT_SALT_ROUNDS)
    );

    const user = await User.create({
        email,
        password: hashedPassword,
        ...rest,
    });
    return user;
};

const getAllUsers = async () => {
    const users = await User.find();
    const totalUsers = await User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers,
        },
    };
};

// update user every single user field except email and password
const updateUser = async (
    userId: string,
    payload: Partial<IUser>,
    decodedToken: JwtPayload
) => {
    const ifUserExist = await User.findById(userId);

    if (!ifUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (payload.role) {
        if (
            decodedToken.role === Role.USER ||
            decodedToken.role === Role.GUIDE
        ) {
            throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized');
        }

        if (
            payload.role === Role.SUPER_ADMIN &&
            decodedToken.role === Role.ADMIN
        ) {
            throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized');
        }
    }

    if (payload.isActive || payload.isDeleted) {
        if (
            decodedToken.role === Role.USER ||
            decodedToken.role === Role.GUIDE
        ) {
            throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized');
        }
    }

    if (payload.password) {
        payload.password = await bcryptjs.hash(
            payload.password,
            Number(envVars.BCRYPT_SALT_ROUNDS)
        );
    }

    const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });

    return newUpdateUser;
};

// get all users

export const UserService = {
    createUser,
    updateUser,
    getAllUsers,
};
