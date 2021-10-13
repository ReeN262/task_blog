import {Request, Response} from 'express';
import * as PostService from './postService';
import {errorRes, resultRes} from '@helper/responseAnswer';
import {findUserById} from '@components/user/userService';
import {findPostByFilter} from './postService';

export const createPost = async (req: Request, res: Response) => {
  const {user, ...rest} = await PostService.createPost(req.body, req.user);
  return resultRes(res, {data: rest, user: user.name});
};

export const getOnePost = async (req: Request, res: Response) => {
  const post = await PostService.getOnePost(req.params.id);

  if (!post) return errorRes(res, 'Post undefined', 400);

  return resultRes(res, {data: post});
};

export const getAllUserPost = async (req: Request, res: Response) => {
  const user = await findUserById(req.query.userId as string);

  if (!user) return errorRes(res, 'user undefined', 400);

  const allUserPost = await PostService.getAllUserPost(req.query, user);

  if (!allUserPost) return errorRes(res, 'Post undefined', 400);

  return resultRes(res, {data: allUserPost});
};

export const getAllPost = async (req: Request, res: Response) => {
  return resultRes(res, await PostService.getAllPost(req.query));
};

export const updatePost = async (req: Request, res: Response) => {
  const userPost = await findPostByFilter({id: req.body.postId, user: req.user});

  if (!userPost) return errorRes(res, 'This is not your post', 400);

  const updatedPost = await PostService.updatePost(req.body, userPost);
  return resultRes(res, {data: updatedPost});
};

export const deleteOnePost = async (req: Request, res: Response) => {
  const userPost = await findPostByFilter({id: req.params.postId as unknown as number, user: req.user});

  if (!userPost) return errorRes(res, 'This is not your post', 400);

  await PostService.deleteOnePost(userPost.id);
  return resultRes(res, {deleteResult: userPost});
};
