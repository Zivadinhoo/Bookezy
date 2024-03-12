import { IHotel } from './hotel';

export type HotelSearchResponse = {
  data: IHotel[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};
