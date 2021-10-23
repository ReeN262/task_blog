import request from 'supertest';
import {getManager} from 'typeorm';

import connectionDb from '../../db';
import {Post} from '@components/post/postEntity';
import {Comment} from '@components/comment/commentEntity';
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

describe('/comment', () => {
  beforeEach(async () => {
    const res = await api.post('/account/sign-up')
        .send({name: 'comment', password: '123banda', phone: '+3-222-555-0194'});
    expect(res.statusCode).toBe(200);
    cookie = res.headers['set-cookie'];

    await api.post('/post/create')
        .set('Cookie', cookie)
        .send({title: 'comment', description: 'test'});
  });
  afterEach(async () => {
    await clearDatabaseAndRedis();
  });

  describe('POST /comment', () => {
    test('create comment', async () => {
      const post = await Post.findOne() as Post;
      const res = await api.post('/comment/create')
          .set('Cookie', cookie)
          .send({post: post.id, description: 'test'});
      expect(res.statusCode).toBe(200);
      expect(res.error).toBe(false);
      expect(res.body).not.toBeUndefined();
      expect(await Comment.findOne()).not.toBeUndefined();
    });
  });

  describe('get all post comments, update and delete', () => {
    beforeEach(async ()=> {
      const {id} = await Post.findOne() as Post;
      await api.post('/comment/create')
          .set('Cookie', cookie)
          .send({post: id, description: 'comment'});
    });

    describe('GET /comment/allPostComments', () => {
      test('return all post comments', async () => {
        const post = await Post.findOne() as Post;
        const res = await api.get(`/comment/allPostComments/?postId=${post.id}`)
            .set('Cookie', cookie);
        expect(res.statusCode).toBe(200);
        expect(res.error).toBe(false);
        expect(res.body).not.toBeUndefined();
        expect(await Comment.findOne()).not.toBeUndefined();
      });
    });

    describe('PUT /comment/update', () => {
      test('updating comment', async () => {
        const {id} = await Comment.findOne() as Comment;
        const res = await api.put(`/comment/update`)
            .set('Cookie', cookie)
            .send({commentId: id, description: 'test'});
        expect(res.statusCode).toBe(200);
        expect(res.error).toBe(false);
        expect(res.body).not.toBeUndefined();
        expect(await Comment.findOne()).not.toBeUndefined();
      });

      describe('DELETE /comment/delete/:id', () => {
        test('remove comment', async () => {
          const {id} = await Comment.findOne() as Comment;
          const res = await api.delete(`/comment/delete/${id}`)
              .set('Cookie', cookie);
          expect(res.statusCode).toBe(200);
          expect(res.error).toBe(false);
          expect(res.body).not.toBeUndefined();
          expect(await Comment.findOne()).toBeUndefined();
        });
      });
    });
  });
});

