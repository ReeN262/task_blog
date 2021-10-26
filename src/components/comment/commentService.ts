import {Comment} from '@components/comment/commentEntity';
import {Post} from '@components/post/postEntity';
import {User} from '@components/user/userEntity';
import {getRepository} from 'typeorm';
import {Like} from '@components/like/likeEntity';

interface InputData {
  postId: string,
  offset: number,
  skip: number,
}
interface FilterI {
  id: string,
  user: User,
  description?: string,
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
    .createQueryBuilder('comment')
    .select('comment.*')
    .addSelect('COUNT(likes.entityId)', 'countLikes')
    .leftJoin(Like, 'likes', 'likes.entityId = comment.id')
    .where({post: data.postId})
    .skip(data.skip)
    .take(data.offset)
    .groupBy('comment.id')
    .getRawMany();

export const updateComment = async (commentId: string, newDescription: string): Promise<Comment> => {
  const updated = await getRepository(Comment)
      .createQueryBuilder('comment')
      .update(Comment)
      .set({description: newDescription})
      .where({id: commentId})
      .returning('*')
      .execute();
  return updated.raw[0];
};

export const findCommentByFilter = (filter: Filter): Promise<Comment | undefined> => Comment.findOne(filter);

export const findCommentById = (id: string | number): Promise<Comment | undefined> => Comment.findOne(id);

export const deleteComment = async (comment: Comment): Promise<Comment> => Comment.remove(comment);
