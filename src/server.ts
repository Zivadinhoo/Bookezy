import 'dotenv/config';
import 'colors';
import env from './util/validateEnv';
import mongoose from 'mongoose';
import userRoutes from './routes/users';
import hotelRoutes from './routes/hotels';
import authRouter from './routes/auth';
import cookieParser from 'cookie-parser';
import path from 'path';
import morgan from 'morgan';

import express, { Request, Response } from 'express';
import cors from 'cors';

const port = env.PORT;
const app = express();

app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());

app.use(cors());

app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.use('/api', userRoutes);
app.use('/api', hotelRoutes);
app.use('/api/auth', authRouter);

async function connDbAndStartServer() {
  try {
    await mongoose.connect(env.MONGO_CONNECTION_STRING);
    console.log('Mongoose Connected'.magenta);
    app.listen(port, () => {
      console.log(('Server running on port' + port).cyan);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
}

connDbAndStartServer();
