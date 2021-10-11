import bcrypt from 'bcrypt';
import {User} from './userEntity';
import {getRepository} from 'typeorm';

type UserId = number;

interface InputData {
  name: string,
  password: string,
  email: string,
  phone: string,
  login: string,
}

export const createNewUser = async (data: InputData): Promise<UserId> => {
  const salt = bcrypt.genSaltSync(10);
  const {name, password, email='', phone=''} = data;

  const user = User.create({
    name: name,
    password: bcrypt.hashSync(password, salt),
    email: email,
    phone: phone,
  });
  await user.save();

  return user.id;
};

export const findForUserByLogin = (login: string): Promise<User | undefined> => getRepository(User)
    .createQueryBuilder('user')
    .where({email: login})
    .orWhere({phone: login})
    .getOne();

export const passwordVerification = (verifyPassword: string, userPassword: string = ''): boolean => {
  return bcrypt.compareSync(verifyPassword, userPassword);
};

export const findUserByFilter = async (filter: string): Promise<User | undefined> => {
  return await User.findOne(filter);
};

export const findUserById = async (id: string | undefined): Promise<User | undefined> => {
  return await User.findOne(id);
};
