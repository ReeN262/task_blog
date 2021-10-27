import request from 'supertest';
const api = request('localhost:8080');
import {getManager} from 'typeorm';
import connectionDb from '../../db';
import {User} from '@components/user/userEntity';
import redis from 'redis';


describe('/user', ()=> {
  let user: User;
  let cookie: string;
  const redisClient = redis.createClient({
    host: '172.17.0.1',
    port: 6379,
  });
  const data = {
    name: 'test',
    password: '123banda',
    phone: '+1-212-555-0191',
  };
  const testData = {phone: data.phone};

  const clearDatabase = async () => {
    await getManager().remove(user);
  };

  const clearRedis = () => {
    const sessionId = cookie[0].split('%3A')[1].split('.')[0];
    redisClient.del(`sess:${sessionId}`);
  };

  beforeAll(async () => {
    await connectionDb;
  });

  afterEach(() => {
    clearRedis();
  });
  describe('POST /sign-up', ()=> {
    test('registration by phone number US', async () => {
      const res = await api.post('/account/sign-up')
          .send(data);
      cookie = res.headers['set-cookie'];
      expect(res.statusCode).toBe(200);
      expect(cookie[0]).not.toBeNull();
      expect(res.error).toBe(false);
      expect(res.body).not.toBeUndefined();
      user = await User.findOne(testData) as User;
      expect(user).toEqual(expect.objectContaining(testData));
      expect(res.body).toStrictEqual({id: user.id});
    } );
  });

  describe('GET /sign-in', ()=> {
    afterEach(async () => {
      await clearDatabase();
      clearRedis();
    });
    test('auth by phone number US', async () => {
      const res = await api.get('/account/sign-in')
          .send({password: '123banda', login: '+1-212-555-0191'});
      cookie = res.headers['set-cookie'];
      expect(res.statusCode).toBe(200);
      expect(cookie[0]).not.toBeNull();
      expect(res.error).toBe(false);
      user = await User.findOne(testData) as User;
      expect(user).toEqual(expect.objectContaining(testData));
      expect(res.body).toStrictEqual({id: user.id});
    });
  });
});
