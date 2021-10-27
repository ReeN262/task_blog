import request from 'supertest';
import {getRepository} from 'typeorm';

import connectionDb from '../../db';
import {Post} from '@components/post/postEntity';
import redis from 'redis';
import {User} from '@components/user/userEntity';


describe('/post', () => {
  const redisClient = redis.createClient({
    host: '172.17.0.1',
    port: 6379,
  });
  let userId: string;
  let postId: string;
  let cookie: string[];
  const api = request('localhost:8080');
  const testData = {
    title: 'post',
    description: 'test',
  };

  beforeAll(async () => {
    await connectionDb;
  });

  const clearDatabaseAndRedis = async () => {
    await getRepository(User).delete(userId);
    const sessionId = cookie[0].split('%3A')[1].split('.')[0];
    redisClient.del(`sess:${sessionId}`);
  };

  beforeEach(async () => {
    const res = await api.post('/account/sign-up')
        .send({name: 'post', password: '123banda', phone: '+2-24-555-0194'});
    cookie = res.headers['set-cookie'];
    userId = res.body.id;
  });
  afterEach(async () => {
    await clearDatabaseAndRedis();
  });
  describe('POST /post/create', () => {
    test('create post', async () => {
      const data = {title: 'postgres', description: 'test'};
      const res = await api.post('/post/create')
          .set('Cookie', cookie)
          .send(data);
      expect(res.statusCode).toBe(200);
      expect(res.error).toBe(false);
      expect(res.body).not.toBeUndefined();
      expect(res.body).toEqual(expect.objectContaining({
        title: data.title,
        description: data.description,
        id: res.body.id,
        user: userId,
      }));
      expect(await Post.findOne({
        where: {
          title: res.body.title,
        },
      })).not.toBeUndefined();
    });
  });

  describe('rest', () => {
    beforeEach(async () => {
      const res = await api.post('/post/create')
          .set('Cookie', cookie)
          .send(testData);
      postId = res.body.id;
    });
    describe('GET /post/getOne', () => {
      test('return one post', async () => {
        const res = await api.get(`/post/getOne/${postId}`)
            .set('Cookie', cookie);
        expect(res.statusCode).toBe(200);
        expect(res.error).toBe(false);
        expect(res.body).not.toBeUndefined();
        expect(await Post.findOne(postId)).not.toBeUndefined();
        expect(res.body).toEqual(
            expect.objectContaining({
              title: testData.title,
              description: testData.description,
              id: postId,
              userid: userId,
              countLikes: '0',
            }),
        );
      });
    });
    describe('GET /post/getAllPost', () => {
      test('return all post', async () => {
        const res = await api.get('/post/getAllPost')
            .set('Cookie', cookie);
        expect(res.statusCode).toBe(200);
        expect(res.error).toBe(false);
        expect(res.body).not.toBeUndefined();
        expect(await Post.find()).not.toBeUndefined();
        expect(res.body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                title: testData.title,
                description: testData.description,
                id: postId,
                userId: userId,
                countLikes: '0',
              }),
            ]),
        );
      });
    });
    describe('GET /post/getAllUserPost', () => {
      test('return all user post', async () => {
        const res = await api.get(`/post/getAllUserPost/?userId=${userId}`)
            .set('Cookie', cookie);
        expect(res.statusCode).toBe(200);
        expect(res.error).toBe(false);
        expect(res.body).not.toBeUndefined();
        expect(await Post.findOne()).not.toBeUndefined();
        expect(res.body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                title: testData.title,
                description: testData.description,
                id: postId,
                userId: userId,
                countLikes: '0',
              }),
            ]),
        );
      });
    });
    describe('PUT /post/update', () => {
      test('updating post', async () => {
        const data = {postId: postId, title: 'yes', description: 'ofc'};
        const res = await api.put(`/post/update`)
            .send(data)
            .set('Cookie', cookie);
        expect(res.statusCode).toBe(200);
        expect(res.error).toBe(false);
        expect(res.body).not.toBeUndefined();
        expect(await Post.find()).not.toBeUndefined();
        expect(res.body).toEqual(
            expect.objectContaining({
              title: data.title,
              description: data.description,
              id: postId,
            }),
        );
      });
    });
    describe('DELETE /post/delete', () => {
      test('remove post', async () => {
        const res = await api.delete(`/post/delete/${postId}`)
            .set('Cookie', cookie);
        expect(res.statusCode).toBe(200);
        expect(res.error).toBe(false);
        expect(res.body).not.toBeUndefined();
        expect(await Post.findOne(postId)).toBeUndefined();
        expect(res.body).toEqual(
            expect.objectContaining({
              title: testData.title,
              description: testData.description,
            }),
        );
      });
    });
  });
});

