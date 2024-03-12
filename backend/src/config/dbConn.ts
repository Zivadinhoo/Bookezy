import mongoose from 'mongoose';
import env from '../util/validateEnv';

const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_CONNECTION_STRING);
    console.log('Mongoose connected'.green);
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
};

export default connectDB;
