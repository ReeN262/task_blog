import 'dotenv/config';
import express from 'express';
import redis from 'redis';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import connectRedis from 'connect-redis';

import connectionDb from './db';
import {userRouter} from '@components/user/userRouter';

const client = redis.createClient();
const redisStore = connectRedis(session);
const app = express();

const main = async () => {
  try {
    await connectionDb;
    console.log('Database connection');

    app.use(cookieParser());
    app.use(express.json());
    app.use(session({
      store: new redisStore({
        host: 'localhost',
        port: 6379,
        client: client,
      }),
      secret: `${process.env.SECRET}`,
      resave: false,
      saveUninitialized: true,
      // cookie: {secure: true},
    }));

    app.use('/account', userRouter);

    app.listen(process.env.PORT, () => console.log('Server start'));
  } catch (error) {
    console.log(`Connection error: ${error}`);
  }
};

main();
