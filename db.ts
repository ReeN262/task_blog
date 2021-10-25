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
    username: 'reen',
    password: '12345678',
    database: 'postgres',
    entities: [User, Post, Like, Comment],
    synchronize: true,
    logging: false,
  });
};

export = connection()

