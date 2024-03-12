import express from 'express';
import verifyToken from '../middleware/verifyTokenMiddleware';
import { body } from 'express-validator';
import { getAllHotels } from '../controllors/hotelsController';
import { createHotelAndUploadImages, getSingleHotel, updateHotel } from '../controllors/myHotelsController';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fieldSize: 5 * 1024 * 1024 } });

// api/my-hotels
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('country').notEmpty().withMessage('Country is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('type').notEmpty().withMessage('Hotel type is required'),
    body('pricePerNight').notEmpty().isNumeric().withMessage('Price per night  is required and must be a number'),
    body('facilities').notEmpty().isArray().withMessage('Facilities is required'),
  ],
  verifyToken,
  upload.array('imageFiles', 6),
  createHotelAndUploadImages
);

router.get('/', verifyToken, getAllHotels);

router.get('/:id', verifyToken, getSingleHotel);

router.put('/:hotelId', verifyToken, upload.array('imageFiles', 6), updateHotel);

export default router;
