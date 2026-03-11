import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth.js';
import { Role } from '../user/user.interface.js';
import { AuthControllers } from './auth.controller.js';

const router = express.Router();

// Public
router.post('/login', AuthControllers.loginUser);
router.post('/refresh-token', AuthControllers.refreshToken);

// Protected
router.post(
    '/change-password',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.USER),
    AuthControllers.changePassword
);

router.post(
    '/logout',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.USER),
    AuthControllers.logoutUser
);

export const AuthRoutes = router;
