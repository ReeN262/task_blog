import {Router} from 'express';
import {UserController} from '@components/user/userController';

const userRouter = Router();

userRouter.post('/registration', UserController.registration);

export {userRouter};
