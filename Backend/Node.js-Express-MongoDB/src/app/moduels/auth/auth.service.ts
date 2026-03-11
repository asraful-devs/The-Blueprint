import bcryptjs from 'bcryptjs';
import httpStatus from 'http-status-codes';
import { envVars } from '../../config/env.js';
import ApiError from '../../error/ApiError.js';
import { createNewAccessTokenWithRefreshToken } from '../../utils/userTokens.js';
import { IsActive } from '../user/user.interface.js';
import { User } from '../user/user.model.js';
import { TChangePasswordPayload, TLoginPayload } from './auth.interface.js';

const loginUser = async (payload: TLoginPayload) => {
    const { email, password } = payload;

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (user.isDeleted) {
        throw new ApiError(httpStatus.GONE, 'User account has been deleted');
    }

    if (user.isActive === IsActive.BLOCKED) {
        throw new ApiError(httpStatus.FORBIDDEN, 'User account is blocked');
    }

    const isPasswordCorrect = await bcryptjs.compare(
        password,
        user.password as string
    );

    if (!isPasswordCorrect) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password');
    }

    // Todo: Generate access token and refresh token

    return user;
};

const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken =
        await createNewAccessTokenWithRefreshToken(refreshToken);

    return newAccessToken;
};

// Change Password
const changePassword = async (id: string, payload: TChangePasswordPayload) => {
    const user = await User.findOne({ _id: id, isDeleted: false }).select(
        '+password'
    );

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    const isPasswordCorrect = await bcryptjs.compare(
        payload.oldPassword,
        user.password as string
    );

    if (!isPasswordCorrect) {
        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            'Old password is incorrect'
        );
    }

    const hashedPassword = await bcryptjs.hash(
        payload.newPassword as string,
        Number(envVars.BCRYPT_SALT_ROUNDS)
    );

    user.password = hashedPassword;
    await user.save();

    return null;
};

export const AuthServices = {
    getNewAccessToken,
    changePassword,
};
