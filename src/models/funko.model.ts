import mongoose, { Schema, Document, Types } from 'mongoose';

// --- Tipo flexible: cualquier clave booleana ---
export type IFunkoVariant = Record<string, boolean>;

// --- Schema abierto: acepta cualquier campo booleano sin necesidad de declararlo ---
const funkoVariantSchema = new Schema<IFunkoVariant>({}, { _id: false, strict: false });

// --- Documento principal: Funko ---
export interface IFunko extends Document {
  funkoId: number;
  name: string;
  type: string;
  series: Types.ObjectId;
  barcode?: number;
  variants: IFunkoVariant;
  imageUrl?: string;
  boxImageUrl?: string;
  store?: Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const funkoSchema = new Schema<IFunko>(
  {
    funkoId:    { type: Number, required: true, index: true },
    name:       { type: String, required: true, trim: true },
    type:       { type: String, default: 'Pop', trim: true },
    series:     { type: Schema.Types.ObjectId, ref: 'Series', required: true, index: true },
    barcode:    { type: Number },
    variants:   { type: funkoVariantSchema, default: () => ({}) },
    imageUrl:   { type: String },
    boxImageUrl:{ type: String },
    store:      { type: Schema.Types.ObjectId, ref: 'Store', index: true },
    notes:      { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

funkoSchema.index({ name: 'text' });
funkoSchema.index({ series: 1, funkoId: 1 });

export const Funko = mongoose.model<IFunko>('Funko', funkoSchema);
