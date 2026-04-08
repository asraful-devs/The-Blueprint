import express from 'express';
import vaildateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { createUserZodSchema, updateUserZodSchema } from './user.vaildation';

const router = express.Router();

router.post(
    '/create-user',
    vaildateRequest(createUserZodSchema),
    UserController.CreateUser
);

router.get('/', UserController.GetAllUsers);
router.get('/:id', UserController.GetSingleUser);

router.patch(
    '/:id',
    vaildateRequest(updateUserZodSchema),
    UserController.UpdateUser
);

router.delete('/:id', UserController.DeleteUser);

export const UserRoutes = router;
