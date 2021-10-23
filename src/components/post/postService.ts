import {Post} from '@components/post/postEntity';
import {getRepository} from 'typeorm';
import {Like} from '@components/like/likeEntity';

interface PostI {
  title: string,
  description: string,
  userId: number,
  postId: number | string;
  skip: number,
  offset: number,
}
interface UserI {
  id?: string;
  name?: string,
  password?: string,
  email?: string,
  phone?: string,
}
interface FilterI {
  id: string,
  user: UserI;
}
type Filter = Partial<FilterI>
type InputData = Partial<PostI>

export const createPost = async (data: InputData, user: UserI): Promise<Post> => {
  const newPost = Post.create({
    title: data.title,
    description: data.description,
    user: user,
  });
  await newPost.save();

  return newPost;
};

export const getOnePost = (postId: string): Promise<Post | undefined> => getRepository(Post)
    .createQueryBuilder('post')
    .select('post.*')
    .addSelect('COUNT(likes.entityId)', 'countLikes')
    .leftJoin(Like, 'likes', 'likes.entityId = post.id')
    .where({id: postId})
    .groupBy('post.id, likes.id')
    .getRawOne();

export const getPostInArrAndSmallDescription = (arrPosts: any): Array<Post> => arrPosts.map((post: any) => {
  return {
    id: post.id,
    tittle: post.title,
    description: post.description.length < 200 ? post.description : `${post.description.substr(0, 200)}...`,
    user: post.userId,
    countLikes: post.countLikes,
    createdAt: post.create_at,
    updatedAt: post.update_at,
  };
});

export const getAllUserPost = async (data: InputData, user: UserI): Promise<Array<Post>> => {
  const arrPosts = await getRepository(Post)
      .createQueryBuilder('post')
      .select('post.*')
      .addSelect('COUNT(likes.entityId)', 'countLikes')
      .leftJoin(Like, 'likes', 'likes.entityId = post.id')
      .andWhere({user: user})
      .skip(data.skip)
      .take(data.offset)
      .orderBy({create_at: 'DESC'})
      .groupBy('post.id')
      .getRawMany();

  return getPostInArrAndSmallDescription(arrPosts);
};

export const getAllPost = async (data: InputData): Promise<Array<Post>> => {
  const allPost = await getRepository(Post)
      .createQueryBuilder('post')
      .select('post.*')
      .addSelect('COUNT(likes.entityId)', 'countLikes')
      .leftJoin(Like, 'likes', 'likes.entityId = post.id')
      .orderBy({create_at: 'DESC'})
      .skip(data.skip)
      .take(data.offset)
      .groupBy('post.id')
      .getRawMany();

  return getPostInArrAndSmallDescription(allPost);
};

export const findPostByFilter = (filter: Filter): Promise<Post | undefined> => Post.findOne(filter);

export const updatePost = async (data: InputData, post: Post): Promise<Post> => {
  const {title = null, description = null} = data;

  post.title = title || post.title;
  post.description = description || post.description;

  await post.save();
  return post;
};

export const deleteOnePost = (post: Post): Promise<Post> => Post.remove(post);

export const findPostById = (id: string): Promise<Post | undefined> => Post.findOne(id);
