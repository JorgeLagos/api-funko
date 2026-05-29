import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUserCollection extends Document {
  userId:              Types.ObjectId;
  seriesId:            Types.ObjectId;
  ownedFunkos:         Types.ObjectId[];
  notInterestedFunkos: Types.ObjectId[];
  inStoreFunkos:       Types.ObjectId[];
  createdAt:           Date;
  updatedAt:           Date;
}

const userCollectionSchema = new Schema<IUserCollection>(
  {
    userId:              { type: Schema.Types.ObjectId, ref: 'User',   required: true, index: true },
    seriesId:            { type: Schema.Types.ObjectId, ref: 'Series', required: true, index: true },
    ownedFunkos:         [{ type: Schema.Types.ObjectId, ref: 'Funko' }],
    notInterestedFunkos: [{ type: Schema.Types.ObjectId, ref: 'Funko' }],
    inStoreFunkos:       [{ type: Schema.Types.ObjectId, ref: 'Funko' }],
  },
  { timestamps: true }
);

// Un usuario no puede agregar la misma serie dos veces
userCollectionSchema.index({ userId: 1, seriesId: 1 }, { unique: true });

export const UserCollection = mongoose.model<IUserCollection>('UserCollection', userCollectionSchema);
