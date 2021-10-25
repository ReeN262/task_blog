import request from 'supertest';
const api = request('localhost:8080');
import {getManager} from 'typeorm';
import connectionDb from '../../db';
import {User} from '@components/user/userEntity';
import redis from 'redis';


describe('/user', ()=> {
  const redisClient = redis.createClient({
    host: '172.17.0.1',
    port: 6379,
  });

  const clearDatabaseAndRedis = async () => {
    await connectionDb;
    await getManager().query('TRUNCATE users CASCADE');
    redisClient.flushall('ASYNC');
  };
  // const sessionId = res.headers['set-cookie'][0].split('%3A')[1].split('.')[0];
  // const redisSession = (redisClient.get(`sess:${sessionId}`));
  afterEach(() => {
    redisClient.flushall('ASYNC');
  });
  describe('POST /sign-up', ()=> {
    test('registration by phone number US', async () => {
      const res = await api.post('/account/sign-up')
          .send({name: 'test', password: '123banda', phone: '+1-212-555-0194'});
      expect(res.statusCode).toBe(200);
      expect(res.headers['set-cookie'][0]).not.toBeNull();
      expect(res.error).toBe(false);
      expect(res.body).not.toBeUndefined();
      const user = await User.findOne() as User;
      expect(user).not.toBeUndefined();
      expect(res.body).toStrictEqual({id: user.id});
    } );
  });

  describe('GET /sign-in', ()=> {
    afterEach(async () => {
      await clearDatabaseAndRedis();
    });
    test('auth by phone number US', async () => {
      const res = await api.get('/account/sign-in')
          .send({password: '123banda', login: '+1-212-555-0194'});
      expect(res.statusCode).toBe(200);
      expect(res.headers['set-cookie'][0]).not.toBeNull();
      expect(res.error).toBe(false);
      const user = await User.findOne() as User;
      expect(user).not.toBeUndefined();
      expect(res.body).toStrictEqual({id: user.id});
    });
  });
});
