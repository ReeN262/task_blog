import request from 'supertest';
import {Post} from '@components/post/postEntity';
import {Like} from '@components/like/likeEntity';
import redis from 'redis';
import connectionDb from '../../db';
import {getManager} from 'typeorm';

const redisClient = redis.createClient({
  host: '172.17.0.1',
  port: 6379,
});
const api = request('localhost:8080');
let cookie: string[];

const clearDatabaseAndRedis = async () => {
  await connectionDb;
  await getManager().query('TRUNCATE users CASCADE');
  redisClient.flushall('ASYNC');
};

describe('/likes', () => {
  beforeEach(async () => {
    const res = await api.post('/account/sign-up')
        .send({name: 'test', password: '123banda', phone: '+1-222-555-0194'});
    expect(res.statusCode).toBe(200);
    cookie = res.headers['set-cookie'];

    await api.post('/post/create')
        .set('Cookie', cookie)
        .send({title: 'test', description: 'test'});
  });
  afterEach(async () => {
    await clearDatabaseAndRedis();
  });

  describe('POST /addLikePost', () => {
    test('add like to post', async () => {
      const {id} = await Post.findOne() as Post;
      const res = await api.post(`like/addlike/?entityId${id}=&entityType=post`)
          .set('Cookie', cookie);
      expect(res.statusCode).toBe(200);
      expect(res.error).toBe(false);
      expect(res.body).not.toBeUndefined();
      expect(await Like.findOne()).not.toBeUndefined();
    });
  });
  describe('POST /removeLike', () => {
    test('add like to post', async () => {
      const {id} = await Post.findOne() as Post;
      const res = await api.post(`like/removeLike/?entityId${id}=&entityType=post`)
          .set('Cookie', cookie);
      expect(res.statusCode).toBe(200);
      expect(res.error).toBe(false);
      expect(res.body).not.toBeUndefined();
      expect(await Like.findOne()).toBeUndefined();
    });
  });
});
