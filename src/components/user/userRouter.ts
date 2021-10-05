import {Router} from 'express';
import * as UserController from '@components/user/userController';
import {passport} from '../../middleware/passport';

const userRouter = Router();

userRouter.post('/sign-up', [UserController.signUp]);
// userRouter.get('/id', [passport, UserController.getId]);

export {userRouter};
