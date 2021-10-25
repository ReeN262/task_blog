import * as UserService from './userService';
import {Request, Response} from 'express';
import {errorRes, resultRes} from '@helper/responseAnswer';
import {User} from '@components/user/userEntity';

declare module 'express-session' {
  export interface SessionData {
    userId: string;
  }
}

export const signUp = async (req: Request, res: Response) => {
  const {email='', phone=''} = req.body;
  const findUser = await UserService.findUserByFilter({email: email, phone: phone});

  if (findUser) return errorRes(res, 'Its login already in use', 400);

  const userId = await UserService.createNewUser(req.body);

  req.session.userId = userId;

  return resultRes(res, {id: userId});
};

export const signIn = async (req: Request, res: Response) => {
  const user = await UserService.findForUserByLogin(req.body.login) as User;
  const verification = await UserService.passwordVerification(req.body.password, user?.password);

  if (!verification) return errorRes(res, 'Invalid login or password', 400);

  req.session.userId = user.id;
  return resultRes(res, {id: user.id});
};

export const logout = async (req: Request, res: Response) => {
  req.session.destroy(() => {
    return resultRes(res, {success: true} );
  });
};


