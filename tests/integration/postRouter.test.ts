import request from 'supertest';
import {getManager} from 'typeorm';

import connectionDb from '../../db';
import {Post} from '@components/post/postEntity';
import {User} from '@components/user/userEntity';
import redis from 'redis';

const redisClient = redis.createClient({
  host: '172.17.0.1',
  port: 6379,
});

let cookie: string[];
const api = request('localhost:8080');

const clearDatabaseAndRedis = async () => {
  await connectionDb;
  await getManager().query('TRUNCATE users CASCADE');
  redisClient.flushall('ASYNC');
};

describe('/post', () => {
  beforeEach(async () => {
    const res = await api.post('/account/sign-up')
        .send({name: 'post', password: '123banda', phone: '+2-222-555-0194'});
    expect(res.statusCode).toBe(200);
    cookie = res.headers['set-cookie'];
  });
  afterEach( async () => {
    await clearDatabaseAndRedis();
  });

  describe('POST /post/create', () => {
    test('create post', async () => {
      const res = await api.post('/post/create')
          .set('Cookie', cookie)
          .send({title: 'test', description: 'test'});
      expect(res.statusCode).toBe(200);
      expect(res.error).toBe(false);
      expect(res.body).not.toBeUndefined();
      expect(await Post.findOne({
        where: {
          title: res.body.title,
        },
      })).not.toBeUndefined();
    });
  });

  describe('rest', () => {
    beforeEach(async () => {
      await api.post('/post/create')
          .set('Cookie', cookie)
          .send({title: 'post', description: 'test'});
    });
    test('return one post', async () => {
      const {id} = await Post.findOne() as Post;
      const res = await api.get(`/post/getOne/${id}`)
          .set('Cookie', cookie);
      expect(res.statusCode).toBe(200);
      expect(res.error).toBe(false);
      expect(res.body).not.toBeUndefined();
      expect(await Post.findOne(id)).not.toBeUndefined();
    });
    test('return all post', async () => {
      const res = await api.get('/post/getAllPost')
          .set('Cookie', cookie);
      expect(res.statusCode).toBe(200);
      expect(res.error).toBe(false);
      expect(res.body).not.toBeUndefined();
      expect(await Post.findOne()).not.toBeUndefined();
    });
    test('return all user post', async () => {
      const {id} = await User.findOne() as User;
      const res = await api.get(`/post/getAllUserPost/?userId=${id}`)
          .set('Cookie', cookie);
      expect(res.statusCode).toBe(200);
      expect(res.error).toBe(false);
      expect(res.body).not.toBeUndefined();
      expect(await Post.findOne()).not.toBeUndefined();
    });
    test('updating a post if it not yours', async () => {
      const {id} = await Post.findOne() as Post;
      const res = await api.put(`/post/update`)
          .send({id: id, title: 'yes', description: 'ofc'})
          .set('Cookie', cookie);
      expect(res.statusCode).toBe(400);
      expect(res.body).not.toBeUndefined();
      expect(await Post.findOne()).not.toBeUndefined();
    });
    test('remove post', async () => {
      const {id} = await Post.findOne({where: {title: 'post'}}) as Post;
      const res = await api.delete(`/post/delete/${id}`)
          .set('Cookie', cookie);
      expect(res.statusCode).toBe(200);
      expect(res.error).toBe(false);
      expect(res.body).not.toBeUndefined();
      expect(await Post.findOne()).toBeUndefined();
    });
  });
});

