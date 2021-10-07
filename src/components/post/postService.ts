import {Post} from '@components/post/postEntity';
import {findUserById} from '@components/user/userService';

type FieldName = string;
type Value = string;
type InputData = Record<FieldName, Value>;
type User = Record<FieldName, any> | undefined;
type Query = Record<string, any>;
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

export const getAllUserPost = async (data: Query) => {
  const {userId, skip = 0, offset = 30} = data;
  const user = await findUserById(userId);

  return await Post.find({
    where: {
      user,
    },
    order: {
      createdAt: 'DESC',
    },
    skip: skip,
    take: offset,
  });
};

export const getAllPost = async () => {
  const allPost = await Post.find();
  return Array.from(allPost).map((post) => {
    return {
      tittle: post.title,
      createdAt: post.createdAt,
      description: post.description.length < 200 ? post.description : `${post.description.substr(0, 200)}...`,
    };
  });
};
