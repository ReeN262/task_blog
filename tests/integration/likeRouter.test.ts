import request from 'supertest';
import {Like} from '@components/like/likeEntity';
import redis from 'redis';
import connectionDb from '../../db';
import {getManager} from 'typeorm';

describe('/likes', () => {
  const redisClient = redis.createClient({
    host: '172.17.0.1',
    port: 6379,
  });

  const api = request('localhost:8080');
  let cookie: string[];
  let postId: string;
  let userId: string;

  const clearDatabaseAndRedis = async () => {
    await connectionDb;
    await getManager().query('TRUNCATE users CASCADE');
    redisClient.flushall('ASYNC');
  };

  beforeEach(async () => {
    const res = await api.post('/account/sign-up')
        .send({name: 'test', password: '123banda', phone: '+1-222-555-0194'});
    expect(res.statusCode).toBe(200);
    cookie = res.headers['set-cookie'];
    userId = res.body.id;

    const _res = await api.post('/post/create')
        .set('Cookie', cookie)
        .send({title: 'test', description: 'test'});
    postId = _res.body.id;
  });
  afterEach(async () => {
    await clearDatabaseAndRedis();
  });

  describe('POST /addLikePost', () => {
    test('add like to post', async () => {
      const res = await api.post(`like/addlike/?entityId${postId}=&entityType=post`)
          .set('Cookie', cookie);
      expect(res.statusCode).toBe(200);
      expect(res.error).toBe(false);
      expect(res.body).not.toBeUndefined();
      expect(await Like.findOne()).not.toBeUndefined();
    });
  });
  describe('rest', () => {
    beforeEach(async () => {
      await api.post(`like/addlike/?entityId${postId}=&entityType=post`)
          .set('Cookie', cookie);
    });
    describe('POST /allLike', () => {
      test('return like to post', async () => {
        const res = await api.post(`like/allLike/?entityId${postId}=&entityType=post`)
            .set('Cookie', cookie);
        expect(res.statusCode).toBe(200);
        expect(res.error).toBe(false);
        expect(res.body).not.toBeUndefined();
        expect(await Like.findOne()).not.toBeUndefined();
        expect(res.body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                entityType: 'post',
                entityId: postId,
                userId: userId,
                countLikes: '0',
              }),
            ]),
        );
      });
    });

    describe('POST /removeLike', () => {
      test('add like to post', async () => {
        const res = await api.post(`like/removeLike/?entityId${postId}=&entityType=post`)
            .set('Cookie', cookie);
        expect(res.statusCode).toBe(200);
        expect(res.error).toBe(false);
        expect(res.body).not.toBeUndefined();
        expect(await Like.findOne()).toBeUndefined();
      });
    });
  });
});
