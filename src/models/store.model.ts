import mongoose, { Schema, Document } from 'mongoose';

export interface IStore extends Document {
  name: string;
  slug: string;
  color: string;
  textColor: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const storeSchema = new Schema<IStore>(
  {
    name:      { type: String, required: true, unique: true, trim: true },
    slug:      { type: String, required: true, unique: true, lowercase: true, trim: true },
    color:     { type: String, default: '#1a1a2e', match: /^#[0-9A-Fa-f]{6}$/ },
    textColor: { type: String, default: '#ffffff', match: /^#[0-9A-Fa-f]{6}$/ },
    imageUrl:  { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: contar funkos asociados a la tienda
storeSchema.virtual('funkoCount', {
  ref: 'Funko',
  localField: '_id',
  foreignField: 'store',
  count: true,
});

export const Store = mongoose.model<IStore>('Store', storeSchema);
