import 'dotenv/config';
import 'colors';
import env from './util/validateEnv';
import userRoutes from './routes/users';
import authRouter from './routes/auth';
import cookieParser from 'cookie-parser';
import path from 'path';
import morgan from 'morgan';
import express from 'express';
import cors from 'cors';
import connectDB from './config/dbConn';
import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import MyHotelRoutes from './routes/my-hotels';
import hotelRoutes from './routes/hotels';
import errorMiddleware from './middleware/errorMiddleware';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDB();
console.log(process.env.NODE_ENV?.white);

const port = env.PORT;
const app = express();

app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.use('/api/auth', authRouter);
app.use('/api/users', userRoutes);
app.use('/api/my-hotels', MyHotelRoutes);
app.use('/api/hotels', hotelRoutes);

// All requests that aren't API routes  are going to index.html
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

app.listen(port, () => {
  console.log(` Server running on port ${port}`.black.bold);
});

app.use(errorMiddleware);

export default app;
