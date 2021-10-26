import {Post} from '@components/post/postEntity';
import {User} from '@components/user/userEntity';
import {getManager} from 'typeorm';
import connectionDb from '../../db';
import {createPost} from '@components/post/postService';
import {checkPostOrComment, findLike, getAllLike, like, removeLike} from '@components/like/likeService';
import {createNewUser} from '@components/user/userService';
import {Like} from '@components/like/likeEntity';

interface LikeI {
  entityId: string,
  entityType: string
  skip?: number,
  offset?: number,
}

describe('TEST like service', () => {
  let post: Post;
  let user: User;
  let data: LikeI;
  const testPostData = {
    title: 'test',
    description: 'tests',
  };
  const restUserData = {
    name: 'test',
    email: 'test@test.com',
    password: 'test',
    phone: '123345345',
  };

  beforeAll(async () => {
    await connectionDb;
  });
  beforeEach(async () => {
    user = await createNewUser(restUserData);
    post = await createPost(testPostData, user);
    data = {
      entityId: post.id,
      entityType: 'post',
      skip: 0,
      offset: 30,
    };
    await like(data, user);
    await Like.findOne() as Like;
  });
  const clearDatabase = async () => {
    await getManager().query('truncate users cascade');
  };
  afterEach(async () => {
    await clearDatabase();
  });
  describe('AddLike Function', () => {
    test('post like on post', async () => {
      expect(await like(data, user)).toEqual(true);
      const _like = await Like.findOne();
      await getManager().remove(_like);
    });
  });
  describe('FindLike Function', () => {
    test('search like', async () => {
      expect(await findLike(user, data)).not.toBeUndefined();
    });
  });
  describe('CheckPostOrComment', () => {
    test('return answer true', async () => {
      expect(await checkPostOrComment(data)).toEqual(true);
    });
  });
  describe('getAllLike', () => {
    test('return all post likes', async () => {
      expect(await getAllLike(data)).not.toBeUndefined();
    });
  });
  describe('RemoveLike Function', () => {
    test('remove one post like', async () => {
      const like = await findLike(user, data) as Like;
      expect(await removeLike(like)).not.toBeUndefined();
    });
  });
});
