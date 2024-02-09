import { UserType } from './types';
import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: UserType;
  }
}

export default Express;
