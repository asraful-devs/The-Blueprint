import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import { UserService } from './user.service.js';

const createUser = catchAsync(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (req: Request, res: Response, next: NextFunction) => {
        const user = await UserService.createUser(req.body);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: 'User Create Successfully',
            data: user,
        });
    }
);

const getAllUsers = catchAsync(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await UserService.getAllUsers();

        // res.status(httpStatus.OK).json({
        //     success: true,
        //     message: 'All User get Successfully',
        //     users,
        // });

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: 'User Create Successfully',
            data: result.data,
            meta: result.meta,
        });
    }
);

export const UserControllers = {
    createUser,
    getAllUsers,
};
