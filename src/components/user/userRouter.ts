import {Router} from 'express';
import * as UserController from '@components/user/userController';
import {userSchema} from '@components/user/userSchema';
import {validation} from '@middleware/validation';

const userRouter = Router();

userRouter.post('/sign-up', [validation(userSchema).validate, UserController.signUp]);
userRouter.get('/sign-in', [UserController.signIn]);
userRouter.post('/logout', [UserController.logout]);

export {userRouter};
