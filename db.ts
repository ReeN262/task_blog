import {createConnection, getConnection, getRepository} from "typeorm";
import { User } from "./src/components/user/userEntity";
import { Post } from "./src/components/post/postEntity";

createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.DBUSER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    entities: [User, Post],
    synchronize: true,
    logging: false
})

