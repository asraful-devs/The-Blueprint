import bcryptjs from 'bcryptjs';
import httpStatus from 'http-status-codes';
import { envVars } from '../../config/env.js';
import ApiError from '../../error/ApiError.js';
import { IsActive, IUser, Role } from './user.interface.js';
import { User } from './user.model.js';

// create a user service that handles user-related operations
const createUserFromDB = async (payload: Partial<IUser>) => {
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

// get all users for admin
const getAllUsersFromDB = async () => {
    const users = await User.find();
    const totalUsers = await User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers,
        },
    };
};

// get single user for admin
const getSingleUserFromDB = async (id: string) => {
    const user = await User.findOne({ _id: id, isDeleted: false }).select(
        '-password'
    );
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    return user;
};

// Get my profile for user
const getMyProfileFromDB = async (id: string) => {
    const result = await User.findOne({
        _id: id,
        isDeleted: false,
    }).select('-password');
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    return result;
};

// Update my profile for user
const updateMyProfileIntoDB = async (id: string, payload: Partial<IUser>) => {
    const notAllowed = ['role', 'status', 'isDeleted', 'email', 'password'];
    notAllowed.forEach((field) => {
        if (field in payload) {
            delete (payload as any)[field];
        }
    });

    const result = await User.findOneAndUpdate(
        { _id: id, isDeleted: false },
        payload,
        {
            new: true,
            runValidators: true,
        }
    ).select('-password');

    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    return result;
};

// Block user (admin only)
const blockUserIntoDB = async (id: string) => {
    const user = await User.findOne({ _id: id, isDeleted: false });
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (user.role === Role.SUPER_ADMIN) {
        throw new ApiError(
            httpStatus.FORBIDDEN,
            'You cannot block a super admin'
        );
    }

    const result = await User.findByIdAndUpdate(
        id,
        { isActive: IsActive.BLOCKED },
        { new: true }
    ).select('-password');
    return result;
};

// Unblock user (admin only)
const unblockUserIntoDB = async (id: string) => {
    const user = await User.findOne({ _id: id, isDeleted: false });
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    const result = await User.findByIdAndUpdate(
        id,
        { isActive: IsActive.ACTIVE },
        { new: true }
    ).select('-password');
    return result;
};

// Soft delete user (admin only)
const deleteUserFromDB = async (id: string) => {
    const user = await User.findOne({ _id: id, isDeleted: false });
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (user.role === Role.SUPER_ADMIN) {
        throw new ApiError(
            httpStatus.FORBIDDEN,
            'You cannot delete a super admin'
        );
    }

    const result = await User.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
    ).select('-password');
    return result;
};

// Change user role (admin/superAdmin only)
const changeUserRoleIntoDB = async (id: string, role: string) => {
    const user = await User.findOne({ _id: id, isDeleted: false });
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (user.role === Role.SUPER_ADMIN) {
        throw new ApiError(
            httpStatus.FORBIDDEN,
            'You cannot change super admin role'
        );
    }

    const result = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true, runValidators: true }
    ).select('-password');
    return result;
};

// Get all blocked users for admin
const getAllBlockedUsersFromDB = async () => {
    const users = await User.find({ isActive: IsActive.BLOCKED });
    const totalUsers = await User.countDocuments({
        isActive: IsActive.BLOCKED,
    });
    return {
        data: users,
        meta: {
            total: totalUsers,
        },
    };
};

export const UserServices = {
    createUserFromDB,
    getAllUsersFromDB,
    getSingleUserFromDB,
    getMyProfileFromDB,
    updateMyProfileIntoDB,
    blockUserIntoDB,
    unblockUserIntoDB,
    deleteUserFromDB,
    changeUserRoleIntoDB,
    getAllBlockedUsersFromDB,
};
