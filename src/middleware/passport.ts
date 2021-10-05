import {NextFunction, Response, Request} from 'express';
import {errorRes} from '@components/helper/responseAnswer';
import {User} from '@components/user/userEntity';

declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Express {
    // eslint-disable-next-line no-unused-vars
    interface Request {
      user? : Record<string, any>
    }
  }
}
const passport = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    errorRes(res, 'not authorized', 401);
  }

  const userData = await User.findOne(req.session.userId);

  if (!userData) {
    errorRes(res, 'not authorized', 401);
  }

  req.user = userData;
  next();
};

export {passport};
