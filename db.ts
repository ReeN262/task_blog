import {createConnection} from 'typeorm';
import {User} from '@components/user/userEntity';
import {Post} from '@components/post/postEntity';
import {Like} from '@components/like/likeEntity';
import {Comment} from '@components/comment/commentEntity';

const connection = async () => {
  await createConnection({
    type: 'postgres',
    host: '172.17.0.1',
    port: 5432,
    username: process.env.TEST_DB_USER,
    password: process.env.TEST_PASSWORD,
    database: process.env.TEST_DB,
    entities: [User, Post, Like, Comment],
    synchronize: true,
    logging: false,
  });
};

export = connection()

