import {Like} from '@components/like/likeEntity';
import {User} from '@components/user/userEntity';
import {getRepository} from 'typeorm';
import {findPostById} from '@components/post/postService';
import {findCommentById} from '@components/comment/commentService';
import {Post} from '@components/post/postEntity';
import {Comment} from '@components/comment/commentEntity';

interface LikeI {
    entityId: number,
    entityType: string
    skip?: number,
    offset?: number,
}

type TLike = Partial<LikeI>

export const like = async (data: TLike, user: User) => {
  const owner = 'post' === data.entityType ? new Post : new Comment;
  const addLike = await Like.create({
    owner: owner,
    user,
    entityId: data.entityId,
    entityType: data.entityType,
  });
  await addLike.save();
};

export const findLike = (user: User, data: TLike): Promise<Like | undefined> => getRepository(Like)
    .createQueryBuilder()
    .where({
      user,
      entityId: data.entityId,
      entityType: data.entityType,
    })
    .getOne();

export const checkPostOrComment = async (data: TLike): Promise<boolean> => {
  if (data.entityType === 'post') {
    return await findPostById(data.entityId as number) !== undefined;
  } else {
    return await findCommentById(data.entityId as number) !== undefined;
  }
};

export const getAllLike = async (data: TLike): Promise<Array<Like>> => getRepository(Like)
    .createQueryBuilder()
    .where({
      entityId: data.entityId,
      entityType: data.entityType,
    })
    .skip(data.skip)
    .take(data.offset)
    .getMany();

export const removeLike = async (like: Like): Promise<Like> => Like.remove(like);
