import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Hotel from '../../models/Hotel';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Hotel Model Test', () => {
  it('create & save hotel successfully', async () => {
    const hotelData = {
      userId: 'test',
      name: 'Test Hotel',
      city: '123 Test St',
      country: 'Test Country',
      description: 'Test Hotel',
      type: 'test',
      adultCount: '5',
      childCount: '3',
      facilities: ['wifi', 'Parking', 'Pool'],
      pricePerNight: 120,
      starRating: 5,
      imageUrls: ['uri1', 'uri2'],
      lastUpdated: new Date(),
      bookings: [],
    };

    const hotel = new Hotel(hotelData);
    const savedHotel = await hotel.save();

    expect(savedHotel._id).toBeDefined();
    expect(savedHotel.name).toBeDefined();
    expect(savedHotel.city).toBeDefined();
    expect(savedHotel.country).toBeDefined();
    expect(savedHotel.description).toBeDefined();
    expect(savedHotel.type).toBeDefined();
    expect(savedHotel.adultCount).toBeDefined();
    expect(savedHotel.childCount).toBeDefined();
    expect(savedHotel.facilities).toBeDefined();
    expect(savedHotel.pricePerNight).toBeDefined();
    expect(savedHotel.starRating).toBeDefined();
    expect(savedHotel.imageUrls).toBeDefined();
    expect(savedHotel.lastUpdated).toBeDefined();
    expect(savedHotel.bookings).toBeDefined();
  });

  it('requires name city and country fields', async () => {
    const hotelWIthoutRequiredFields = new Hotel({ rating: 4, rooms: 20 });
    let err: unknown;
    try {
      await hotelWIthoutRequiredFields.save();
    } catch (error) {
      err = error;
    }

    if (err instanceof mongoose.Error.ValidationError) {
      expect(err.errors.name).toBeDefined();
      expect(err.errors.city).toBeDefined();
      expect(err.errors.country).toBeDefined();
    } else {
      throw new Error('Unexpected error type');
    }
  });

  it('updates hotel successfully', async () => {
    const hotel = new Hotel({
      userId: 'test',
      name: 'Test Hotel',
      city: '123 Test St',
      country: 'Test Country',
      description: 'Test Hotel',
      type: 'test',
      adultCount: '5',
      childCount: '3',
      facilities: ['wifi', 'Parking', 'Pool'],
      pricePerNight: 120,
      starRating: 5,
      imageUrls: ['uri1', 'uri2'],
      lastUpdated: new Date(),
      bookings: [],
    });

    const savedHotel = await hotel.save();

    const updatedData = {
      name: 'Updated Hotel',
      city: 'Updated City',
    };

    const updatedHotel = await Hotel.findByIdAndUpdate(savedHotel._id, updatedData, { new: true });
    expect(updatedHotel).not.toBeNull();
    expect(updatedHotel?.name).toBe(updatedData.name);
    expect(updatedHotel?.city).toBe(updatedData.city);
  });

  it('deletes a hotel successfully', async () => {
    const hotel = new Hotel({
      userId: 'test',
      name: 'Hotel to Delete',
      city: '123 Test St',
      country: 'Test Country',
      description: 'Test Hotel',
      type: 'test',
      adultCount: '5',
      childCount: '3',
      facilities: ['wifi', 'Parking', 'Pool'],
      pricePerNight: 120,
      starRating: 5,
      imageUrls: ['uri1', 'uri2'],
      lastUpdated: new Date(),
      bookings: [],
    });

    const savedHotel = await hotel.save();

    const deleteHotel = await Hotel.findByIdAndDelete(savedHotel._id);
    const foundHotel = await Hotel.findById(savedHotel._id);

    expect(deleteHotel).not.toBeNull();
    expect(foundHotel).toBeNull();
  });
});
