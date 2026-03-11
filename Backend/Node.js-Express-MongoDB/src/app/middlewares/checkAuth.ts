import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../config/env.js';
import ApiError from '../error/ApiError.js';
import { IsActive } from '../moduels/user/user.interface.js';
import { User } from '../moduels/user/user.model.js';

export const checkAuth =
    (...authRoles: string[]) =>
    async (
        req: Request & { user?: JwtPayload },
        res: Response,
        next: NextFunction
    ) => {
        try {
            const accessToken =
                req.headers.authorization || req.cookies.accessToken;

            if (!accessToken) {
                throw new ApiError(403, 'No Token Recieved');
            }

            // const verifiedToken = jwt.verify(accessToken, 'secretOrPrivateKey');

            const verifiedToken = verifyToken(
                accessToken,
                envVars.JWT_ACCESS_TOKEN_SECRET
            ) as JwtPayload;

            const isUserExist = await User.findOne({
                email: verifiedToken.email,
            });

            if (!isUserExist) {
                throw new ApiError(
                    httpStatus.BAD_REQUEST,
                    'User does not exist'
                );
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

            if (!verifiedToken) {
                throw new ApiError(403, 'You are not Authorized');
            }

            if (!authRoles.includes(verifiedToken.role)) {
                throw new ApiError(
                    403,
                    'You are not Permited to view this route!!!'
                );
            }
            req.user = verifiedToken;
            next();
        } catch (error) {
            next(error);
        }
    };
