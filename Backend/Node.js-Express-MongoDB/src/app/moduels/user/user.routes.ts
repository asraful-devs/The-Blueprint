import { Router } from 'express';
import { UserControllers } from './user.controller.js';
import { Role } from './user.interface.js';
import { createUserZodSchema, updateUserZodSchema } from './user.validation.js';

const router = Router();

router.post(
    '/register',
    validateRequst(createUserZodSchema),
    UserControllers.createUser
);

router.patch(
    '/:id',
    validateRequst(updateUserZodSchema),
    checkAuth(...Object.values(Role)),
    multerUpload.single('file'),
    UserControllers.updateUser
);

router.get(
    '/all-users',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    UserControllers.getAllUsers
);

export const UserRoutes = router;
