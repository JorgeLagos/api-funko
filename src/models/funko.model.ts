import mongoose, { Schema, Document, Types } from 'mongoose';
import { VARIANT_KEYS, VARIANT_DEFAULTS, VariantsMap } from '../config/variants.config';

// --- Interfaz de variante (derivada del config) ---
export type IFunkoVariant = VariantsMap;

// --- Schema dinámico generado desde el config ---
const variantFields: Record<string, object> = Object.fromEntries(
  VARIANT_KEYS.map((k: string) => [k, { type: Boolean, default: false }])
);
const funkoVariantSchema = new Schema<IFunkoVariant>(variantFields as any, { _id: false });

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
  store?: string;
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
    variants:   { type: funkoVariantSchema, default: () => ({ ...VARIANT_DEFAULTS }) },
    imageUrl:   { type: String },
    boxImageUrl:{ type: String },
    store:      { type: String, trim: true },
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
