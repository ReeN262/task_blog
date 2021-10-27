import 'dotenv/config';
import express from 'express';
import redis from 'redis';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import connectRedis from 'connect-redis';

import {userRouter} from '@components/user/userRouter';
import {postRouter} from '@components/post/postRouter';
import {commentRouter} from '@components/comment/commentRouter';
import likeRouter from '@components/like/likeRouter';
import './db';

export const app = express();
const redisStore = connectRedis(session);
const client = redis.createClient({
  host: '172.17.0.1',
  port: 6379,
});

const main = async () => {
  // settings
  app.use(cookieParser());
  app.use(express.json());
  app.use(session({
    store: new redisStore({
      client: client,
    }),
    secret: `${process.env.SECRET}`,
    resave: false,
    saveUninitialized: true,
    // cookie: {secure: true},
  }));

  // routers
  app.use('/like', likeRouter);
  app.use('/account', userRouter);
  app.use('/post', postRouter);
  app.use('/comment', commentRouter);

  // start server
  app.listen(process.env.PORT, () => console.log(`Server start`));
};

main();

