import User from '../models/User';
import bcyrpt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ErrorResponse } from '../util/customErrors';
import { IUser } from '../types/user';

export class UsersService {
  static async register(userDetails: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }): Promise<{ message: string; token?: string }> {
    const { email, password, firstName, lastName, role } = userDetails;
    let user = await User.findOne({ email });
    if (user) {
      throw new ErrorResponse('User with that email alredy exsists', 409);
    }
    // 10 rounds of hashing for security reasons.
    const hashedPassword = await bcyrpt.hash(password, 10);
    user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
    });
    await user.save();

    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    if (!jwtSecretKey) {
      throw new ErrorResponse('JWT_SECRET_KEY is not defined', 500);
    }
    const token = jwt.sign({ userId: user.id }, jwtSecretKey, { expiresIn: '1d' });

    return { message: 'User registered successfully', token };
  }

  static async getUserById(userId: string): Promise<IUser | null> {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new ErrorResponse('User not found', 404);
    }
    return user;
  }

  static async updateUserById(
    userId: string,
    updateData: { firstName?: string; lastName?: string; email?: string }
  ): Promise<IUser | null> {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
    if (!updatedUser) {
      throw new ErrorResponse('User not Found', 404);
    }
    return updatedUser;
  }

  static async deleteUserbyId(userId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ErrorResponse('User not found', 404);
    }
    await User.findByIdAndDelete(userId);
  }

  static async findOne({ email }: { email: string }): Promise<IUser | null> {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return null;
    }
    return user;
  }
}
