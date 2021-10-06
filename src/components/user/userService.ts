import bcrypt from 'bcrypt';
import {User} from './userEntity';

type FieldName = string;
type Value = string;
type InputData = Record<FieldName, Value>;
type UserID = number

export const signUp = async (data: InputData): Promise<UserID | false> => {
  const salt = bcrypt.genSaltSync(10);
  const {name, password, email = '', phone = ''} = data;
  const loginAlreadyUse = await User.findOne({email, phone});

  if (loginAlreadyUse) return false;

  const user = User.create({
    name: name,
    password: bcrypt.hashSync(password, salt),
    email: email,
    phone: phone,
  });
  const saveNewUser = await user.save();

  return saveNewUser.id;
};

export const findForUserByLogin = async (login: string): Promise<User | false> => {
  const findByEmail = await User.findOne({email: login});
  const findByPhone = await User.findOne({phone: login});

  if (findByEmail) return findByEmail;
  else if (findByPhone) return findByPhone;
  else return false;
};

export const signIn = async (data: InputData): Promise<UserID | false> => {
  const {login, password} = data;
  const user = await findForUserByLogin(login) as User;

  if (user) {
    const passwordIsTrue = bcrypt.compareSync(password, user.password);
    if (passwordIsTrue) return user.id;
    else return false;
  } else {
    return false;
  }
};


