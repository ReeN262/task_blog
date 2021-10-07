import {z} from 'zod';
import {NextFunction, Request, Response} from 'express';
import {resultRes} from '@components/../helper/responseAnswer';

export const validation = (schema: z.Schema<unknown>) => {
  return {
    validate(req: Request, res: Response, next: NextFunction) {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return resultRes(res, result.error);
      }
      next();
    },
  };
};
