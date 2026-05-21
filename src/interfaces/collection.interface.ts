import { Types } from 'mongoose';

/** Serie populada dentro de UserCollection (campos selectos tras .populate) */
export interface PopulatedSeries {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  imageUrl?: string;
}
