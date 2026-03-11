import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth.js';
import { Role } from '../user/user.interface.js';
import { AuthControllers } from './auth.controller.js';

const router = Router();

router.post('/login', AuthControllers.credentialsLogin);
router.post('/refresh-token', AuthControllers.getNewAccessToken);
router.post('/logout', AuthControllers.logout);
router.post(
    '/reset-password',
    checkAuth(...Object.values(Role)),
    AuthControllers.resetPassword
);

export const AuthRoutes = router;
