import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { AuthService } from '../services/authService';
import { ErrorResponse } from '../util/customErrors';

export const loginUser = async (req: Request, res: Response) => {
  check('email', 'Email is required').isEmail();
  check('password', 'Password with 6 or more characters required').isLength({
    min: 6,
  });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // if there is any validaton error, returns 400 Bad Request.
    return res.status(400).json({ message: errors.array() });
  }
  try {
    const { email, password } = req.body;
    const user = await AuthService.validateUser(email, password);
    const token = AuthService.generateToken(user._id);
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400000, //24h in miliseconds.
    });

    res.status(200).json({ userId: user._id });
  } catch (error) {
    console.error(`Error while logging in. Operation: User login. Method: ${req.method}, Path: ${req.path}`, error);

    if (error instanceof ErrorResponse) {
      res.status(error.statusCode).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: 'Something went wrong with server' });
    }
  }
};

export const validateToken = async (req: Request, res: Response) => {
  res.status(200).json({ userId: req.userId });
};

export const logout = async (req: Request, res: Response) => {
  res.cookie('auth_token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.sendStatus(204);
};
