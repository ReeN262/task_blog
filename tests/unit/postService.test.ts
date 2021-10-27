import connectionDb from '../../db';
import {getManager} from 'typeorm';
import {User} from '@components/user/userEntity';
import {Post} from '@components/post/postEntity';
import {
  createPost,
  deleteOnePost,
  findPostByFilter,
  findPostById,
  getAllPost,
  getAllUserPost,
  getOnePost,
  getPostInArrAndSmallDescription, updatePost,
} from '@components/post/postService';

describe('TEST post service', () => {
  let post: Post;
  let user: User;
  const testPostData = {
    title: 'testPost',
    description: 'testsPost',
  };

  const clearDatabase = async () => {
    await getManager().remove(user);
  };

  beforeAll(async () => {
    await connectionDb;
  });
  beforeEach( async () => {
    user = await User.create({
      name: 'testPost',
      email: 'test@testPost.com',
      password: 'test',
      phone: '123345345',
    });
    await user.save();

    post = await createPost(testPostData, user);
  });

  afterEach(async () => {
    await clearDatabase();
  });
  describe('CreateNewPost Function', () => {
    test('return new post', async () => {
      const data = {
        title: 'fixsiki',
        description: 'hello',
      };
      expect(await createPost(data, user)).toEqual(expect.objectContaining({
        title: data.title,
        description: data.description,
        user: user,
      }));
    });
  });

  describe('GetOnePost Function', () => {
    test('return one post', async () => {
      expect(await getOnePost(post.id)).toEqual(expect.objectContaining({
        id: post.id,
      }));
    });
  });
  describe('GetAllUserPost Function', () => {
    test('return all user post', async () => {
      const data = {
        skip: 0,
        offset: 30,
      };
      expect(await getAllUserPost(data, user)).toEqual(expect.arrayContaining([
        expect.objectContaining({
          userId: user.id,
        }),
      ]));
    });
  });
  describe('GetPostInArrAndSmallDescription Function', () => {
    test('return post with clipped description', async () => {
      expect(await getPostInArrAndSmallDescription([post])).not.toEqual(post.description.length > 200);
    });
  });
  describe('GetAllPost Function', () => {
    test('return all post', async () => {
      const data = {
        skip: 0,
        offset: 30,
      };
      expect(await getAllPost(data)).toEqual(expect.arrayContaining([
        expect.objectContaining({
          id: post.id,
          title: post.title,
          description: post.description,
        }),
      ]));
    });
  });
  describe('FindPostByFilter Function', () => {
    test('return post by filter', async () => {
      expect(await findPostByFilter({title: testPostData.title})).toEqual(expect.objectContaining({
        id: post.id,
        title: post.title,
        description: post.description,
      }));
    });
  });
  describe('FindPostById Function', () => {
    test('return post by id', async () => {
      expect(await findPostById(post.id)).toEqual(expect.objectContaining({
        id: post.id,
        title: post.title,
        description: post.description,
      }));
    });
  });
  describe('UpdatePost Function', () => {
    test('return updated post', async () => {
      const updData = {
        title: 'fixsiki_2.0',
        description: 'hello',
      };
      expect(await updatePost(updData, post)).toEqual(expect.objectContaining(updData));
    });
  });
  describe('DeleteOnePost Function', () => {
    test('remove post and show removed post', async () => {
      expect(await deleteOnePost(post)).toEqual(expect.objectContaining({
        title: post.title,
        description: post.description,
      }));
    });
  });
});


