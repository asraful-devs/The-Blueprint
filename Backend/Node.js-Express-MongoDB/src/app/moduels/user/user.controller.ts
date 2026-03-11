import httpStatus from 'http-status-codes';
import { AuthenticatedRequest } from '../../interface/index.js';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import { Role } from './user.interface.js';
import { UserServices } from './user.service.js';

const createUser = catchAsync(async (req, res) => {
    const result = await UserServices.createUserFromDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'User registered successfully',
        data: result,
    });
});

const getAllUsers = catchAsync(async (req, res) => {
    const result = await UserServices.getAllUsersFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Users retrieved successfully',
        data: result,
    });
});

const getSingleUser = catchAsync(async (req, res) => {
    const result = await UserServices.getSingleUserFromDB(
        req.params.id as string
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User retrieved successfully',
        data: result,
    });
});

const getMyProfile = catchAsync(async (req, res) => {
    const result = await UserServices.getMyProfileFromDB(
        (req as AuthenticatedRequest).user._id
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Profile retrieved successfully',
        data: result,
    });
});

const updateMyProfile = catchAsync(async (req, res) => {
    const result = await UserServices.updateMyProfileIntoDB(
        (req as AuthenticatedRequest).user._id,
        req.body
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Profile updated successfully',
        data: result,
    });
});

const blockUser = catchAsync(async (req, res) => {
    const result = await UserServices.blockUserIntoDB(req.params.id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User blocked successfully',
        data: result,
    });
});

const unblockUser = catchAsync(async (req, res) => {
    const result = await UserServices.unblockUserIntoDB(
        req.params.id as string
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User unblocked successfully',
        data: result,
    });
});

const deleteUser = catchAsync(async (req, res) => {
    const result = await UserServices.deleteUserFromDB(req.params.id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User deleted successfully',
        data: result,
    });
});

const changeUserRole = catchAsync(async (req, res) => {
    const result = await UserServices.changeUserRoleIntoDB(
        req.params.id as string,
        req.body.role as Role
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User role updated successfully',
        data: result,
    });
});

export const UserControllers = {
    createUser,
    getAllUsers,
    getSingleUser,
    getMyProfile,
    updateMyProfile,
    blockUser,
    unblockUser,
    deleteUser,
    changeUserRole,
};
