import 'dotenv/config';
import express from 'express';

import connectionDb from './db';
import {userRouter} from '@components/user/userRouter';

const app = express();
app.use(express.json());

const main = async () => {
  try {
    await connectionDb;
    console.log('Database connection');
    // router
    app.use('/account', userRouter);

    app.listen(process.env.PORT, () => console.log('Server start'));
  } catch (error) {
    console.log(`Connection error: ${error}`);
  }
};

main();
