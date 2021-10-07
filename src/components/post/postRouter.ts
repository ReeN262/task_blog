import {Router} from 'express';
import * as PostController from './postController';
import {passport} from '@middleware/passport';
const postRouter = Router();

postRouter.post('/create', [passport, PostController.createPost]);
postRouter.get('/getOne/:postId', [passport, PostController.getOnePost]);
postRouter.get('/getAllUserPost', [passport, PostController.getAllUserPost]);
postRouter.get('/getAllPost', [passport, PostController.getAllPost]);
export {postRouter};
