import httpStatus from 'http-status-codes';

import { envVars } from '../../config/env.js';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import { AuthServices } from './auth.service.js';

// Login
const loginUser = catchAsync(async (req, res) => {
    const result = await AuthServices.loginUser(req.body);

    // set refresh token in cookie
    res.cookie('refreshToken', result.refreshToken, {
        secure: envVars.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User logged in successfully',
        data: {
            accessToken: result.accessToken,
        },
    });
});

// Refresh Token
const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await AuthServices.refreshToken(refreshToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Access token retrieved successfully',
        data: result,
    });
});

// Change Password
const changePassword = catchAsync(async (req, res) => {
    const result = await AuthServices.changePassword(req.user._id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password changed successfully',
        data: result,
    });
});

// Logout
const logoutUser = catchAsync(async (req, res) => {
    res.clearCookie('refreshToken', {
        secure: envVars.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'none',
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User logged out successfully',
        data: null,
    });
});

export const AuthControllers = {
    loginUser,
    refreshToken,
    changePassword,
    logoutUser,
};
