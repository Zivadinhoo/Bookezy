import { IUser } from '../types/user';
import { ErrorResponse } from '../util/customErrors';
import { UsersService } from './usersService';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService {
  static async validateUser(email: string, password: string): Promise<IUser> {
    const user = await UsersService.findOne({ email });
    if (!user) {
      throw new ErrorResponse('Invalid Credentials', 401);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ErrorResponse('Invalid Credentials', 401);
    }
    return user;
  }

  static generateToken(userId: string): string {
    return jwt.sign({ userId }, process.env.JWT_SECRET_KEY as string, {
      expiresIn: '1d',
    });
  }

  static decodeToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET_KEY as string);
  }
}
