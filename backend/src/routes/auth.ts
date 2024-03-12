import express from 'express';
import { loginUser, validateToken, logout } from '../controllors/authController';
import { loginValidators } from '../validators/authValidators';
import { validateRequest } from '../middleware/validationMiddleware';
import verifyToken from '../middleware/verifyTokenMiddleware';

const router = express.Router();

router.post('/login', loginValidators, validateRequest, loginUser);

router.get('/validate-token', verifyToken, validateToken);

router.post('/logout', logout);

export default router;
