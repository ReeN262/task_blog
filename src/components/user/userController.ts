import {UserService} from './userService';
import {Request, Response} from 'express';
import {resultRes} from '@components/helper/responseAnswer';

declare module 'express-session' {
  export interface SessionData {
    userId: any;
  }
}

const signUp = async (req: Request, res: Response) => {
  req.session.userId = await UserService.signUp(req.body);

  resultRes(res, {success: true});
};

export {signUp};

