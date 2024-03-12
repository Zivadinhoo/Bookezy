import mongoose from 'mongoose';
import { IBooking } from './booking';

export interface IHotel extends mongoose.Document {
  userId: string;
  _id: string;
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  adultCount: number;
  childCount: number;
  facilities: string[];
  pricePerNight: number;
  starRating: number;
  imageUrls: string[];
  lastUpdated: Date;
  bookings: IBooking[];
}
