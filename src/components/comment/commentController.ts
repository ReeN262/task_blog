import * as CommentService from './commentService';
import {Response, Request} from 'express';
import {findPostById} from '@components/post/postService';
import {errorRes, resultRes} from '@helper/responseAnswer';
import {getAllPostComments} from './commentService';

export const createComment = async (req: Request, res: Response) => {
  const _post = await findPostById(req.body.post);
  if (!_post) return errorRes(res, 'post not found', 404);

  const {user, post, ...rest} = await CommentService.createNewComment(_post, req.user, req.body.description);
  return resultRes(res, {
    id: rest.id,
    user: user.id,
    post: post.id,
    description: rest.description,
    createdAt: rest.createdAt,
    updatedAt: rest.updatedAt,
  });
};

export const allPostComments = async (req: Request, res: Response) => {
  const post = await findPostById(req.query.postId as string);

  if (!post) return errorRes(res, 'post t1', 404);

  const posts = await getAllPostComments(req.query);
  return resultRes(res, posts);
};

export const updateComment = async (req: Request, res: Response) => {
  const isAuthor = await CommentService.findCommentByFilter({
    id: req.body.commentId,
    user: req.user,
  });

  if (!isAuthor) return errorRes(res, 'you not is author', 400);

  const updatedPost = await CommentService.updateComment(req.body.commentId, req.body.description);
  return resultRes(res, updatedPost);
};

export const deleteComment = async (req: Request, res: Response) => {
  const findComment = await CommentService.findCommentByFilter({
    id: req.params.id as unknown as string,
    user: req.user,
  });

  if (!findComment) return errorRes(res, 'comment not found', 404);

  const deleteComment = await CommentService.deleteComment(findComment);
  return resultRes(res, deleteComment);
};
