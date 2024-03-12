import express from 'express';

import { registerUser, updateUserById, deleteUserById, getSingleUserbyId } from '../controllors/usersController';
import verifyToken from '../middleware/verifyTokenMiddleware';

const router = express.Router();

router.post('/register', registerUser);

router.get('/:id', getSingleUserbyId);

router.put('/:id', verifyToken, updateUserById);

router.delete('/:id', verifyToken, deleteUserById);

export default router;
