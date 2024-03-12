import express from 'express';
import {
  getAllHotels,
  getHotelById,
  updateHotelById,
  deleteHotelById,
  searchHotels,
} from '../controllors/hotelsController';
import verifyToken from '../middleware/verifyTokenMiddleware';

const router = express.Router();

// api/hotels/search
router.get('/search', searchHotels);

router.get('/', getAllHotels);
router.get('/:id', getHotelById);

router.put('/:id', verifyToken, updateHotelById);
router.delete('/:id', verifyToken, deleteHotelById);

export default router;
