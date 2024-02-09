import express, { Request, Response } from 'express';
import Hotel from '../models/hotel';
import verifyToken from '../middleware/auth';
import User from '../models/user';

const router = express.Router();

router.get('/hotels', async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find();
    console.log(hotels);
    res.json(hotels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.get('/hotels/:id', async (req: Request, res: Response) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json(hotel);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.put('/update', verifyToken, async (req: Request, res: Response) => {
  const { firstName, lastName, email } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        firstName,
        lastName,
        email,
      },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.delete('/delete', verifyToken, async (req: Request, res: Response) => {
  try {
    await User.findByIdAndDelete(req.userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;
