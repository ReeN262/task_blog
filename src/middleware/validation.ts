import * as z from 'zod';
import {NextFunction, Request, Response} from 'express';
import {errorRes} from '@helper/responseAnswer';

export const validation = (schema: z.Schema<any>) => {
  return {
    body: (req: Request, res: Response, next: NextFunction) => {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return errorRes(res, result.error, 400);
      }
      next();
    },
    query: (req: Request, res: Response, next: NextFunction) => {
      const result = schema.safeParse(req.query);
      if (!result.success) {
        return errorRes(res, result.error, 400);
      }
      req.query = result.data;
      next();
    },
    params: (req: Request, res: Response, next: NextFunction) => {
      const result = schema.safeParse(req.params);
      if (!result.success) {
        return errorRes(res, result.error, 400);
      }
      req.params = result.data;
      next();
    },
  };
};


