import {Request, Response} from 'express';
import * as PostService from './postService';
import {errorRes, resultRes} from '@helper/responseAnswer';
import {findUserById} from '@components/user/userService';
import {findPostByFilter} from './postService';

export const createPost = async (req: Request, res: Response) => {
  const post = await PostService.createPost(req.body, req.user);
  return resultRes(res, post);
};

export const getOnePost = async (req: Request, res: Response) => {
  const post = await PostService.getOnePost(req.params.id);

  if (!post) return errorRes(res, 'Post not found', 404);

  return resultRes(res, post);
};

export const getAllUserPost = async (req: Request, res: Response) => {
  const user = await findUserById(req.query.userId as string);

  if (!user) return errorRes(res, 'user not found', 404);

  const allUserPost = await PostService.getAllUserPost(req.query, user);

  if (!allUserPost) return errorRes(res, 'Post not found', 404);

  return resultRes(res, allUserPost);
};

export const getAllPost = async (req: Request, res: Response) => {
  return resultRes(res, await PostService.getAllPost(req.query));
};

export const updatePost = async (req: Request, res: Response) => {
  const userPost = await findPostByFilter({id: req.body.postId, user: req.user});

  if (!userPost) return errorRes(res, 'This is not your post', 400);

  const updatedPost = await PostService.updatePost(req.body, userPost);
  return resultRes(res, updatedPost);
};

export const deleteOnePost = async (req: Request, res: Response) => {
  const userPost = await findPostByFilter({
    id: req.params.id as unknown as string,
    user: req.user,
  });

  if (!userPost) return errorRes(res, 'This is not your post', 400);

  const deletePost = await PostService.deleteOnePost(userPost);
  return resultRes(res, deletePost);
};
