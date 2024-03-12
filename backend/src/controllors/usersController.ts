import { Request, Response } from 'express';
import { UsersService } from '../services/usersService';
import asyncHandler from '../middleware/asyncMiddleware';
import { ErrorResponse } from '../util/customErrors';

//@Desc Register new user
//@Route api/register
//@access Public
//@Method POST

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const userDetails = req.body;
  const { message, token } = await UsersService.register(userDetails);
  if (token) {
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400000, // 24h in miliseconds
    });
  }
  return res.status(201).json({ message });
});

export const getSingleUserbyId = asyncHandler(async (req: Request, res: Response) => {
  const user = await UsersService.getUserById(req.params.id);
  res.status(200).json(user);
});

// @Desc Update user by ID
// @Route api/users:/id
// @access Private
// @Method PUT

export const updateUserById = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email } = req.body;
  try {
    const updatedUser = await UsersService.updateUserById(req.params.id, { firstName, lastName, email });
    res.json(updatedUser);
  } catch (error) {
    console.error(
      `Error updating user: ${req.params.id}. Operation: Update user details. Method: ${req.method}, Path: ${req.path} `,
      error
    );
    if (error instanceof ErrorResponse) {
      res.status(error.statusCode).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: 'Something went wrong with server' });
    }
  }
});

// @Desc Delete user by ID
// @Route api/users:/id
// @access Private/Admin
// Method DELETE

export const deleteUserById = asyncHandler(async (req: Request, res: Response) => {
  await UsersService.deleteUserbyId(req.params.id);
  res.status(204).send('User successfully deleted');
});
