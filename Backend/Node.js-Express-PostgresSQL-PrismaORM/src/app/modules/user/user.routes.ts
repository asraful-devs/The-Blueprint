import express from 'express';
import vaildateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { createUserZodSchema } from './user.vaildation';

const router = express.Router();

router.post(
    '/create-user',
    vaildateRequest(createUserZodSchema),
    UserController.CreateUser
);

export const UserRoutes = router;
