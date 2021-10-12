import {Post} from '@components/post/postEntity';
import {DeleteResult, getRepository} from 'typeorm';

interface PostI {
  title: string,
  description: string,
  userId: number,
  postId: number | string;
  skip: number,
  offset: number,
}
interface UserI {
  id?: number;
  name?: string,
  password?: string,
  email?: string,
  phone?: string,
}
interface FilterI {
  id: number,
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

export const getOnePost = async (postId: string): Promise<Post | undefined> => await Post.findOne(postId);

export const getPostInArrAndSmallDescription = (arrPosts: any): Array<Post> => arrPosts.map((post: any) => {
  return {
    id: post.id,
    tittle: post.title,
    createdAt: post.createdAt,
    description: post.description.length < 200 ? post.description : `${post.description.substr(0, 200)}...`,
  };
});

export const getAllUserPost = async (data: InputData, user: UserI): Promise<Array<Post>> => {
  const arrPosts = await getRepository(Post)
      .createQueryBuilder('post')
      .where({user: user})
      .orderBy({create_at: 'DESC'})
      .skip(data.skip)
      .take(data.offset)
      .getMany();

  return getPostInArrAndSmallDescription(arrPosts);
};

export const getAllPost = async (data: InputData): Promise<Array<Post>> => {
  const allPost = await getRepository(Post)
      .createQueryBuilder('post')
      .orderBy({create_at: 'DESC'})
      .skip(data.skip)
      .take(data.offset)
      .getMany();

  return getPostInArrAndSmallDescription(allPost);
};

export const findPostByFilter = (filter: Filter): Promise<Post | undefined> => {
  console.log(filter);
  return Post.findOne(filter);
};

export const updatePost = async (data: InputData, post: Post): Promise<Post> => {
  const {title = null, description = null} = data;

  post.title = title || post.title;
  post.description = description || post.description;

  await post.save();

  return post;
};

export const deleteOnePost = async (postId: number): Promise<DeleteResult> => Post.delete(postId);
