import * as UserService from './userService';
import {Request, Response} from 'express';
import {errorRes, resultRes} from '@components/helper/responseAnswer';

declare module 'express-session' {
  export interface SessionData {
    userId: any;
  }
}

export const signUp = async (req: Request, res: Response) => {
  const newUserId = await UserService.signUp(req.body);

  if (newUserId) {
    req.session.userId = newUserId;
    return resultRes(res, {success: true});
  } else {
    return errorRes(res, 'Its login already in use', 400);
  }
};

export const signIn = async (req: Request, res: Response) => {
  const userId = await UserService.signIn(req.body);

  if (userId) {
    req.session.userId = userId;
    return resultRes(res, {success: true});
  } else {
    return errorRes(res, 'Invalid login or password', 400);
  }
};

export const logout = async (req: Request, res: Response) => {
  req.session.destroy(()=> {
    return resultRes(res, {success: true} );
  });
};


