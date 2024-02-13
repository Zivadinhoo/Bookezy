import express, { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { loginUser, registerUser, validateToken, logout } from '../controllors/authController';
import { loginValidators } from '../validators/authValidators';

const router = express.Router();

router.post('/register', registerUser);

router.post(
  '/login',
  loginValidators,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    next();
  },
  loginUser
);

router.get('/validateToken', validateToken);

router.post('/logout', logout);

export default router;
