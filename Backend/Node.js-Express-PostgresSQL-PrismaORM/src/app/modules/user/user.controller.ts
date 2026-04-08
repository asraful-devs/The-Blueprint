import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

const CreateUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createUser(req);

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: 'User created successfully !',
        data: result,
    });
});

const GetAllUsers = catchAsync(async (_req: Request, res: Response) => {
    const result = await UserService.getAllUsers();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Users retrieved successfully !',
        data: result,
    });
});

const GetSingleUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.getSingleUser(req);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'User retrieved successfully !',
        data: result,
    });
});

const UpdateUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.updateUser(req);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'User updated successfully !',
        data: result,
    });
});

const DeleteUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.deleteUser(req);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'User deleted successfully !',
        data: result,
    });
});

export const UserController = {
    CreateUser,
    GetAllUsers,
    GetSingleUser,
    UpdateUser,
    DeleteUser,
};
