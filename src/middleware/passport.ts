import {NextFunction, Response, Request} from 'express';
import {errorRes} from '@components/../helper/responseAnswer';
import {User} from '@components/user/userEntity';

declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Express {
    // eslint-disable-next-line no-unused-vars
    interface Request {
      user: User;
    }
  }
}

export const passport = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return errorRes(res, 'not authorized', 401);
  }

  const user = await User.findOne(req.session.userId);

  if (!user) {
    return errorRes(res, 'not authorized', 401);
  }
  req.user = user;
  next();
};

