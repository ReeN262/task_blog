import {createConnection} from 'typeorm';
import {User} from '@components/user/userEntity';
import {Post} from '@components/post/postEntity';
import {Like} from '@components/like/likeEntity';
import {Comment} from '@components/comment/commentEntity';


const connection = async () => {
  await createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    entities: [User, Post, Like, Comment],
    synchronize: true,
    logging: false,
  });
};

export = connection()
