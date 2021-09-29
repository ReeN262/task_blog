import {User} from "./userEntity";
import {getConnection} from "typeorm";

export default class userService {
    public static async reg() {
        const connection = getConnection();
        const user = connection.getRepository(User);
        console.log(user.findOne())
    }
}

