import request from 'supertest';
import {getManager} from 'typeorm';

import connectionDb from '../../db';
import {Post} from '@components/post/postEntity';
import {Comment} from '@components/comment/commentEntity';
import redis from 'redis';

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

  const clearDatabaseAndRedis = async () => {
    await connectionDb;
    await getManager().query('TRUNCATE users CASCADE');
    redisClient.flushall('ASYNC');
  };

  beforeEach(async () => {
    const res = await api.post('/account/sign-up')
        .send({name: 'comment', password: '123banda', phone: '+3-222-555-0194'});
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
      const comment = await Comment.findOne() as Comment;
      expect(comment).not.toBeUndefined();
      expect(res.body).toEqual(
          expect.objectContaining( {
            id: comment.id,
            description: data.description,
            user: userId,
            post: postId,
          }),
      );
    });
  });

  describe('get all post comments, update and delete', () => {
    beforeEach(async ()=> {
      const {id} = await Post.findOne() as Post;
      const res = await api.post('/comment/create')
          .set('Cookie', cookie)
          .send({post: id, description: 'comment'});
      commentId = res.body.id;
    });

    describe('GET /comment/allPostComments', () => {
      test('return all post comments', async () => {
        const res = await api.get(`/comment/allPostComments/?postId=${postId}`)
            .set('Cookie', cookie);
        expect(res.statusCode).toBe(200);
        expect(res.error).toBe(false);
        expect(res.body).not.toBeUndefined();
        expect(await Comment.findOne()).not.toBeUndefined();
        expect(res.body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: commentId,
                description: 'comment',
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
        const res = await api.put(`/comment/update`)
            .set('Cookie', cookie)
            .send({commentId: commentId, description: 'test2'});
        expect(res.statusCode).toBe(200);
        expect(res.error).toBe(false);
        expect(res.body).not.toBeUndefined();
        expect(await Comment.findOne()).not.toBeUndefined();
        expect(res.body).toEqual(
            expect.objectContaining({
              id: commentId,
              description: 'test2',
              userId: userId,
              postId: postId,
            }),
        );
      });

      describe('DELETE /comment/delete/:id', () => {
        test('remove comment', async () => {
          const comment = await Comment.findOne(commentId) as Comment;
          const res = await api.delete(`/comment/delete/${comment.id}`)
              .set('Cookie', cookie);
          expect(res.statusCode).toBe(200);
          expect(res.error).toBe(false);
          expect(res.body).not.toBeUndefined();
          expect(await Comment.findOne()).toBeUndefined();
          expect(res.body).toEqual(
              expect.objectContaining({
                description: 'comment',
              }),
          );
        });
      });
    });
  });
});

