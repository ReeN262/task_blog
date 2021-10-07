import {Request, Response} from 'express';
import * as PostService from './postService';
import {errorRes, resultRes} from '@helper/responseAnswer';


export const createPost = async (req: Request, res: Response) => {
  const result = await PostService.createPost(req.body, req.user);

  if (result) {
    return resultRes(res, result);
  } else {
    return errorRes(res, 'error create post', 400);
  }
};

export const getOnePost = async (req: Request, res: Response) => {
  const post = await PostService.getOnePost(req.params.postId);

  if (post) {
    return resultRes(res, {data: post});
  } else {
    return errorRes(res, 'Post undefined', 400);
  }
};

export const getAllUserPost = async (req: Request, res: Response) => {
  const allUserPost = await PostService.getAllUserPost(req.query);
  if (allUserPost) {
    return resultRes(res, {data: allUserPost});
  } else {
    return errorRes(res, 'Post undefined', 400);
  }
};

export const getAllPost = async (req: Request, res: Response) => {
  return resultRes(res, await PostService.getAllPost());
};
