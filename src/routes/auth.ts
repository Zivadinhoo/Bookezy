import express, { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import verifyToken from '../middleware/auth';

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User alredy exsists' });
    }

    // Password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating new user with hashed password

    user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    await user.save(); // Saving user in DB

    // Generating JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string, {
      expiresIn: '1d',
    });

    // Sending token as HTTP only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400000, //24h in miliseconds
    });

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Someting went wrong' });
  }
});

const loginValidators = [
  check('email', 'Email is required').isEmail(),
  check('password', 'Password with 6 more characters is required').isLength({ min: 6 }),
];

router.post('/login', loginValidators, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log('Found user', user);
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string, {
      expiresIn: '1d',
    });

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400000, //24h in miliseconds.
    });

    res.status(200).json({ userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Route for token validation
router.get('/validate-token', verifyToken, (req: Request, res: Response) => {
  res.status(200).json({ userId: req.userId });
});

// Logout route

router.post('/logout', (req: Request, res: Response) => {
  res.cookie('auth_token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.sendStatus(200);
});

export default router;
