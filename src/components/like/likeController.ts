import * as LikeService from './likeService';
import {Request, Response} from 'express';
import {errorRes, resultRes} from '@helper/responseAnswer';

export const like = async (req: Request, res: Response) => {
  const checkLike = await LikeService.findLike(req.user, req.query);
  if (checkLike) return errorRes(res, 'you have already liked', 400);

  const checkPostAndComment = await LikeService.checkPostOrComment(req.query);
  if (!checkPostAndComment) return errorRes(res, 'there is no post or comment', 400);

  await LikeService.like(req.query, req.user);
  return resultRes(res, {res: true});
};

export const allLikes = async (req: Request, res: Response) => {
  const checkPostAndComment = await LikeService.checkPostOrComment(req.query);
  if (!checkPostAndComment) return errorRes(res, 'there is no post or comment', 400);

  const likes = await LikeService.getAllLike(req.query);
  return resultRes(res, likes);
};

export const removeLike = async (req: Request, res: Response) => {
  const like = await LikeService.findLike(req.user, req.query);
  if (!like) return errorRes(res, 'like is not found', 400);

  const remove = await LikeService.removeLike(like);
  return resultRes(res, {removeLike: remove});
};
