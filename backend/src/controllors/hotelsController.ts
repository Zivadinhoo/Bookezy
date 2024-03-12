import { Request, Response } from 'express';
import { Hotel } from '../models/Hotel';
import { HotelSearchResponse } from '../types/types';

export const getAllHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const searchHotels = async (req: Request, res: Response) => {
  try {
    const pageSize = 5;
    const pageNumber = parseInt(req.query.page ? req.query.page.toString() : '1');

    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find().skip(skip).limit(pageSize);

    const total = await Hotel.countDocuments();

    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };
    res.json(response);
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getHotelById = async (req: Request, res: Response) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json(hotel);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const updateHotelById = async (req: Request, res: Response) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedHotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json(updatedHotel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const deleteHotelById = async (req: Request, res: Response) => {
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!deletedHotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json({ message: 'Hotel successfully deleted', hotel: deletedHotel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
