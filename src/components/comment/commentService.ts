import {Comment} from '@components/comment/commentEntity';
import {Post} from '@components/post/postEntity';
import {User} from '@components/user/userEntity';
import {DeleteResult, getRepository} from 'typeorm';

interface InputData {
  postId: string,
  offset: number,
  skip: number,
}
interface FilterI {
  id: number,
  user: User;
}
type Filter = Partial<FilterI>

export const createNewComment = async (post: Post, user: User, description: string) => {
  const newComment = await Comment.create({
    description: description,
    post: post,
    user: user,
  });
  await newComment.save();

  return newComment;
};

export const getAllPostComments = (data: Partial<InputData>): Promise<Array<Comment>> => getRepository(Comment)
    .createQueryBuilder()
    .where({post: data.postId})
    .skip(data.skip)
    .take(data.offset)
    .getMany();

export const update = async (commentId: string, description: string): Promise<Comment> => {
  const updated = await getRepository(Comment)
      .createQueryBuilder('comment')
      .update(Comment)
      .set({description: description})
      .where({id: commentId})
      .returning('*')
      .execute();
  return updated.raw[0];
};

export const findCommentByFilter = (filter: Filter): Promise<Comment | undefined> => Comment.findOne(filter);

export const findCommentById = (id: string): Promise<Comment | undefined> => Comment.findOne(id);

export const deleteComment = async (commentId: number): Promise<DeleteResult> => Comment.delete(commentId);
