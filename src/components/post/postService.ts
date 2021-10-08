import {Post} from '@components/post/postEntity';
import {findUserById} from '@components/user/userService';

type FieldName = string;
type Value = string;
type InputData = Record<FieldName, Value>;
type User = Record<FieldName, Value>;
type InputQuery = Record<string, any> ;

export const createPost = async (data: InputData, user: User) => {
  const {title, description} = data;
  const newPost = Post.create({
    title: title,
    description: description,
    user: user,
  });

  if (newPost) {
    const {createdAt, id} = await newPost.save();
    return {data: {id, title, description, createdAt}};
  } else {
    return false;
  }
};

export const getOnePost = async (postId: string) => {
  return await Post.findOne(postId);
};

export const getPostInArrAndSmallDescription = (arrPosts: any) => {
  return arrPosts.map((post: any) => {
    return {
      id: post.id,
      tittle: post.title,
      createdAt: post.createdAt,
      description: post.description.length < 200 ? post.description : `${post.description.substr(0, 200)}...`,
    };
  });
};

export const getAllUserPost = async (data: InputQuery) => {
  const {userId, skip = 0, offset = 30} = data;
  const user = await findUserById(userId);

  const arrPosts = await Post.find({
    where: {
      user,
    },
    order: {
      createdAt: 'DESC',
    },
    skip: skip,
    take: offset,
  });
  return getPostInArrAndSmallDescription(arrPosts);
};

export const getAllPost = async (data: InputQuery) => {
  const {skip = 0, offset = 30} = data;
  const allPost = await Post.find({
    order: {
      createdAt: 'DESC',
    },
    skip: skip,
    take: offset,
  });
  return getPostInArrAndSmallDescription(Array.from(allPost));
};

// функцию апдейт переделаю

export const updatePost = async (data: InputData, user: User) => {
  const {postId, title = null, description = null} = data;
  const findPost = await Post.findOne({
    where: {
      id: postId,
      user: user,
    },
  });

  if (!findPost) return false;

  findPost.title = title ? title : findPost.title;
  findPost.description = description ? description : findPost.description;

  return await findPost.save();
};

export const deleteOnePost = async (postId: string, user: User) => {
  const userPost = await Post.findOne({where: {id: postId, user}}) as Post;

  if (!userPost) return false;

  const postDelete = await Post.delete(userPost.id);

  if (!postDelete) return false;

  return userPost;
};

