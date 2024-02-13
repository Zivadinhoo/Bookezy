import { body } from 'express-validator';

export const loginValidators = [
  body('email', 'Email is required').isEmail(),
  body('password', 'Password with 6 more characters is required').isLength({ min: 6 }),
];
