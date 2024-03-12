import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
