import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth.js';
import validateRequst from '../../middlewares/validateRequst.js';
import { UserControllers } from './user.controller.js';
import { Role } from './user.interface.js';
import { UserValidation } from './user.validation.js';

const router = express.Router();

// user registration route
router.post(
    '/register',
    validateRequst(UserValidation.createUserValidationSchema),
    UserControllers.createUser
);

// User routes me and update me
router.get(
    '/me',
    checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
    UserControllers.getMyProfile
);

router.patch(
    '/me',
    checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
    UserControllers.updateMyProfile
);

// Admin routes
router.get(
    '/',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    UserControllers.getAllUsers
);

router.get(
    '/:id',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    UserControllers.getSingleUser
);

router.patch(
    '/block/:id',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    UserControllers.blockUser
);

router.patch(
    '/unblock/:id',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    UserControllers.unblockUser
);

router.delete(
    '/delete/:id',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    UserControllers.deleteUser
);

// SuperAdmin only - change role
router.patch(
    '/role/:id',
    checkAuth(Role.SUPER_ADMIN),
    UserControllers.changeUserRole
);

export const UserRoutes = router;
