import httpStatus from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../config/env.js';
import ApiError from '../error/ApiError.js';
import { IsActive, IUser } from '../moduels/user/user.interface.js';
import { User } from '../moduels/user/user.model.js';
import { generateToken, verifyToken } from './jwt.js';

export const createUserTokens = (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };

    const accessToken = generateToken(
        jwtPayload,
        envVars.JWT_ACCESS_TOKEN_SECRET,
        envVars.JWT_ACCESS_EXPIRATION_TIME
    );

    const refreshToken = generateToken(
        jwtPayload,
        envVars.JWT_REFRESH_TOKEN_SECRET,
        envVars.JWT_REFRESH_EXPIRATION_TIME
    );

    return {
        accessToken,
        refreshToken,
    };
};

export const createNewAccessTokenWithRefreshToken = async (
    refreshToken: string
) => {
    const verifiedRefreshToken = verifyToken(
        refreshToken,
        envVars.JWT_REFRESH_TOKEN_SECRET
    ) as JwtPayload;

    const isUserExist = await User.findOne({
        email: verifiedRefreshToken.email,
    });

    if (!isUserExist) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist');
    }
    if (
        isUserExist.isActive === IsActive.BLOCKED ||
        isUserExist.isActive === IsActive.INACTIVE
    ) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            `User is ${isUserExist.isActive}`
        );
    }
    if (isUserExist.isDeleted) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User is deleted');
    }

    const JwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
    };

    const accessToken = generateToken(
        JwtPayload,
        envVars.JWT_ACCESS_TOKEN_SECRET,
        envVars.JWT_ACCESS_EXPIRATION_TIME
    );

    return {
        accessToken,
    };
};
