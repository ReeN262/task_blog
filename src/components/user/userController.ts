import {UserService} from './userService';
import {Request, Response} from 'express';


export class UserController {
  public static async registration(req: Request, res: Response) {
    const result = await UserService.registration(req.body);
    return res.json(result);
  }
}
