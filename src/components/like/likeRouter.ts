import {Router} from 'express';
import * as LikeController from './likeController';
import {passport} from '@middleware/passport';
import * as LikeSchema from './likeSchema';
import {validation} from '@middleware/validation';
const likeRouter = Router();

likeRouter.post('/addLike', [
  passport,
  validation(LikeSchema.like).query,
  LikeController.like,
]);
likeRouter.get('/getLike', [
  passport,
  validation(LikeSchema.allLikes).query,
  LikeController.allLikes,
]);

likeRouter.delete('/removeLike', [
  passport,
  validation(LikeSchema.like).query,
  LikeController.removeLike,
]);

export = likeRouter;
