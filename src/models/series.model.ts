import mongoose, { Schema, Document } from 'mongoose';

export interface ISeries extends Document {
  name: string;
  slug: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const seriesSchema = new Schema<ISeries>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    imageUrl: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: contar funkos de la serie
seriesSchema.virtual('funkoCount', {
  ref: 'Funko',
  localField: '_id',
  foreignField: 'series',
  count: true,
});

export const Series = mongoose.model<ISeries>('Series', seriesSchema);
