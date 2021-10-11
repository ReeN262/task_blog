import {Router} from 'express';
import * as UserController from '@components/user/userController';
import {userSignUpSchema, userSignInSchema} from '@components/user/userSchema';
import {validation} from '@middleware/validation';

const userRouter = Router();

userRouter.post('/sign-up', [
  validation(userSignUpSchema).body,
  UserController.signUp,
]);
userRouter.get('/sign-in', [
  validation(userSignInSchema).body,
  UserController.signIn,
]);
userRouter.post('/logout', [UserController.logout]);

export {userRouter};
