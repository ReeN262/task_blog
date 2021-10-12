import {Router} from 'express';
import * as CommentController from './commentController';
import * as CommentSchema from './commentSchema';
import {passport} from '@middleware/passport';
import {validation} from '@middleware/validation';
const commentRouter = Router();

commentRouter.post('/create', [
  passport,
  validation(CommentSchema.commentCreate).body,
  CommentController.createComment,
]);
commentRouter.get('/allPostComments', [
  passport,
  validation(CommentSchema.allPostComments).query,
  CommentController.allPostComments,
]);
commentRouter.put('/update', [
  passport,
  validation(CommentSchema.updateComment).body,
  CommentController.updateComment,
]);

commentRouter.delete('/delete/:id', [
  passport,
  validation(CommentSchema.commentId).params,
  CommentController.deleteComment,
]);

export {commentRouter};
