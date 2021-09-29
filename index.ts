import 'dotenv/config'
import * as express from 'express';
import userService from "./src/components/user/userService";
const app = express();
app.use(express.json())



app.listen(process.env.PORT , () => console.log('Server start'));