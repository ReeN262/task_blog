import {
  createNewUser,
  findForUserByLogin,
  findUserByFilter,
  findUserById,
  passwordVerification,
} from '@components/user/userService';
import connectionDb from '../../db';
import {getManager} from 'typeorm';
import {User} from '@components/user/userEntity';

describe('TEST user service', () => {
  const testUserDate = {
    name: 'test12',
    password: 'testTEST123',
    email: 'test@test12.com',
    phone: '',
  };
  let user: User;

  beforeAll(async () => {
    await connectionDb;
  });
  beforeEach(async () => {
    user = await createNewUser(testUserDate);
  });

  afterEach(async () => {
    await getManager().remove(user);
  });

  describe('CreateNew Function', () => {
    let _user: User;
    test('create new user', async () => {
      const data = {
        name: 'reen',
        password: '1234banda',
        email: 'korobk@gmail.com',
        phone: '',
      };
      _user = await createNewUser(data);
      expect(_user).toEqual(expect.objectContaining({
        name: data.name,
        email: data.email,
        phone: data.phone,
      }));
      await getManager().remove(_user);
    });
  });
  describe('FindUserByLogin', () => {
    test('find user by login', async () => {
      expect(await findForUserByLogin(testUserDate.email)).toEqual(user);
    });
  });
  describe('PasswordVerification Function', () => {
    test('password verification', async () => {
      expect(await passwordVerification(testUserDate.password, user.password)).toBe(true);
    });
  });
  describe('FindUserByFilter', () => {
    test('find user by filter', async () => {
      expect(await findUserByFilter({email: testUserDate.email})).toEqual(user);
    });
  });
  describe('FindUserById', () => {
    test('find user by id', async () => {
      expect(await findUserById(user.id)).toEqual(user);
    });
  });
});


