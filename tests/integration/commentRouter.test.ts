import request from 'supertest';
import {getRepository} from 'typeorm';

import connectionDb from '../../db';
import {Comment} from '@components/comment/commentEntity';
import redis from 'redis';
import {User} from '@components/user/userEntity';

describe('/comment', () => {
  const redisClient = redis.createClient({
    host: '172.17.0.1',
    port: 6379,
  });

  let postId: string;
  let commentId: string;
  let userId: string;
  let cookie: string[];
  const api = request('localhost:8080');
  const testDescription = 'comment';

  const clearDatabaseAndRedis = async () => {
    await getRepository(User).delete(userId);
    const sessionId = cookie[0].split('%3A')[1].split('.')[0];
    redisClient.del(`sess:${sessionId}`);
  };

  beforeAll(async () => {
    await connectionDb;
  });


  beforeEach(async () => {
    const res = await api.post('/account/sign-up')
        .send({name: 'comment', password: '123banda', phone: '+3-221-555-013'});
    cookie = res.headers['set-cookie'];
    userId = res.body.id;

    const _res = await api.post('/post/create')
        .set('Cookie', cookie)
        .send({title: 'comment', description: 'test'});
    postId = _res.body.id;
  });
  afterEach(async () => {
    await clearDatabaseAndRedis();
  });

  describe('POST /comment', () => {
    test('create comment', async () => {
      const data = {post: postId, description: 'test'};
      const res = await api.post('/comment/create')
          .set('Cookie', cookie)
          .send(data);
      expect(res.statusCode).toBe(200);
      expect(res.error).toBe(false);
      expect(res.body).not.toBeUndefined();
      expect(await Comment.findOne(res.body.id)).not.toBeUndefined();
      expect(res.body).toEqual(
          expect.objectContaining( {
            description: data.description,
            user: userId,
            post: postId,
          }),
      );
    });
  });

  describe('get all post comments, update and delete', () => {
    beforeEach(async ()=> {
      const res = await api.post('/comment/create')
          .set('Cookie', cookie)
          .send({post: postId, description: testDescription});
      commentId = res.body.id;
    });

    describe('GET /comment/allPostComments', () => {
      test('return all post comments', async () => {
        const res = await api.get(`/comment/allPostComments/?postId=${postId}`)
            .set('Cookie', cookie);
        expect(res.statusCode).toBe(200);
        expect(res.error).toBe(false);
        expect(res.body).not.toBeUndefined();
        expect(await Comment.find()).not.toBeUndefined();
        expect(res.body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: commentId,
                description: testDescription,
                userId: userId,
                postId: postId,
                countLikes: '0',
              }),
            ]),
        );
      });
    });

    describe('PUT /comment/update', () => {
      test('updating comment', async () => {
        const updateData = {commentId: commentId, description: 'test2'};
        const res = await api.put(`/comment/update`)
            .set('Cookie', cookie)
            .send(updateData);
        expect(res.statusCode).toBe(200);
        expect(res.error).toBe(false);
        expect(res.body).not.toBeUndefined();
        expect(await Comment.findOne(commentId)).not.toBeUndefined();
        expect(res.body).toEqual(
            expect.objectContaining({
              id: commentId,
              description: updateData.description,
              userId: userId,
              postId: postId,
            }),
        );
      });

      describe('DELETE /comment/delete/:id', () => {
        test('remove comment', async () => {
          const res = await api.delete(`/comment/delete/${commentId}`)
              .set('Cookie', cookie);
          expect(res.statusCode).toBe(200);
          expect(res.error).toBe(false);
          expect(res.body).not.toBeUndefined();
          expect(await Comment.findOne(commentId)).toBeUndefined();
          expect(res.body).toEqual(
              expect.objectContaining({
                description: testDescription,
              }),
          );
        });
      });
    });
  });
});

