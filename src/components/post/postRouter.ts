import {Router} from 'express';
import * as PostController from './postController';
import {passport} from '@middleware/passport';
import {validation} from '@middleware/validation';
import {postSchema} from '@components/post/postSchema';

const postRouter = Router();

postRouter.post('/create', [passport, validation(postSchema).validate, PostController.createPost]);
postRouter.get('/getOne/:postId', [passport, PostController.getOnePost]);
postRouter.get('/getAllUserPost', [passport, PostController.getAllUserPost]);
postRouter.get('/getAllPost', [passport, PostController.getAllPost]);
postRouter.put('/update', [passport, PostController.updatePost]);
postRouter.delete('/delete/:postId', [passport, PostController.deleteOnePost]);

export {postRouter};
