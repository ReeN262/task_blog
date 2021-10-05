import bcrypt from 'bcrypt';
import {User} from './userEntity';

type FieldName = string;
type Value = string;
type InputData = Record<FieldName, Value>;
type userId = Number

export class UserService {
  public static async signUp(data: InputData): Promise<userId> {
    const salt = bcrypt.genSaltSync(10);
    const {name, password, email = '', phone = ''} = data;
    const user = User.create({
      name: name,
      password: bcrypt.hashSync(password, salt),
      email: email,
      phone: phone,
    });
    const saveNewUser = await user.save();

    return saveNewUser.id;
  }
}
