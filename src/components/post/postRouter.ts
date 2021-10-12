import {Router} from 'express';
import * as PostController from './postController';
import {passport} from '@middleware/passport';
import {validation} from '@middleware/validation';
import * as postSchema from '@components/post/postSchema';

const postRouter = Router();

postRouter.post('/create', [
  passport,
  validation(postSchema.postCreate).body,
  PostController.createPost,
]);
postRouter.get('/getOne/:id', [
  passport,
  validation(postSchema.postId).params,
  PostController.getOnePost,
]);
postRouter.get('/getAllUserPost', [
  passport,
  validation(postSchema.allUserPost).query,
  PostController.getAllUserPost,
]);
postRouter.get('/getAllPost', [
  passport,
  validation(postSchema.allPost).query,
  PostController.getAllPost,
]);
postRouter.put('/update', [
  passport,
  validation(postSchema.update).body,
  PostController.updatePost,
]);
postRouter.delete('/delete/:id', [
  passport,
  validation(postSchema.postId).params,
  PostController.deleteOnePost,
]);

export {postRouter};
