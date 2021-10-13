import * as CommentService from './commentService';
import {Response, Request} from 'express';
import {findPostById} from '@components/post/postService';
import {errorRes, resultRes} from '@helper/responseAnswer';
import {getAllPostComments} from './commentService';

export const createComment = async (req: Request, res: Response) => {
  const _post = await findPostById(req.body.post);
  if (!_post) return errorRes(res, 'post undefined', 400);

  const {user, post, ...rest} = await CommentService.createNewComment(_post, req.user, req.body.description);
  return resultRes(res, {
    data: {
      user: user.id,
      post: post.id,
      comment: rest,
    },
  });
};

export const allPostComments = async (req: Request, res: Response) => {
  const post = await findPostById(req.query.postId as string);

  if (!post) return errorRes(res, 'post undefined', 400);

  const posts = await getAllPostComments(req.query);
  return resultRes(res, {data: posts});
};

export const updateComment = async (req: Request, res: Response) => {
  const isAuthor = await CommentService.findCommentByFilter({
    id: req.body.commentId,
    user: req.user,
  });

  if (!isAuthor) return errorRes(res, 'you not is author', 400);

  const updatedPost = await CommentService.update(req.body.commentId, req.body.description);
  return resultRes(res, updatedPost);
};

export const deleteComment = async (req: Request, res: Response) => {
  const findComment = await CommentService.findCommentByFilter({
    id: req.body.commentId,
    user: req.user,
  });

  if (!findComment) return errorRes(res, 'comment not found', 400);

  const deleteComment = await CommentService.deleteComment(findComment);
  return resultRes(res, deleteComment);
};
