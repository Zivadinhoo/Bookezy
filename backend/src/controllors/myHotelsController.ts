import { Request, Response } from 'express';
import { Hotel } from '../models/Hotel';
import cloudinary from 'cloudinary';
import { IHotel } from '../types/hotel';

async function uploadImages(imageFiles: Express.Multer.File[]) {
  if (!imageFiles || imageFiles.length === 0) {
    return [];
  }

  const uploadPromises = imageFiles.map(async image => {
    const b64 = Buffer.from(image.buffer).toString('base64');
    const dataURI = 'data:' + image.mimetype + ';base64,' + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

export const createHotelAndUploadImages = async (req: Request, res: Response) => {
  try {
    const imageFiles = req.files as Express.Multer.File[];
    const newHotel: IHotel = req.body;
    console.log(req.body);

    const imageUrls = await uploadImages(imageFiles);

    newHotel.imageUrls = imageUrls;
    newHotel.lastUpdated = new Date();
    newHotel.userId = req.userId;

    // save the new hotel in database
    const hotel = new Hotel(newHotel);
    await hotel.save();

    // return a 201 means created
    res.status(201).send(hotel);
  } catch (error) {
    console.log('Error creating hotel:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getAllHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hotels' });
  }
};

export const getSingleHotel = async (req: Request, res: Response) => {
  const id = req.params.id.toString();

  try {
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.userId,
    });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ messag: 'Error fetching hotels' });
  }
};

export const updateHotel = async (req: Request, res: Response) => {
  try {
    const updatedHotel: IHotel = req.body;
    updatedHotel.lastUpdated = new Date();

    const hotel = await Hotel.findOneAndUpdate(
      {
        _id: req.params.hotelId,
        userId: req.userId,
      },
      updatedHotel,
      { new: true }
    );

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const files = req.files as Express.Multer.File[];
    const updatedImageUrls = await uploadImages(files);

    hotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls || [])];
    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};
