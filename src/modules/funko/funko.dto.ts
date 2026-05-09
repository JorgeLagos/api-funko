import { z } from 'zod';
import { VARIANT_KEYS, VARIANT_DEFAULTS } from '../../config/variants.config';

// Schema de variante generado dinámicamente desde el config
const variantFields = Object.fromEntries(
  VARIANT_KEYS.map(k => [k, z.boolean().default(false)])
);
const variantSchema = z.object(variantFields as Record<string, z.ZodDefault<z.ZodBoolean>>);

export const createFunkoSchema = z.object({
  funkoId:    z.number().int().positive('FunkoId debe ser positivo'),
  name:       z.string().min(1, 'El nombre es requerido').max(200),
  type:       z.string().max(50).default('Pop'),
  series:     z.string().regex(/^[a-f\d]{24}$/i, 'ID de serie inválido'),
  variants:   variantSchema.optional().default({ ...VARIANT_DEFAULTS }),
  imageUrl:   z.string().url().optional(),
  boxImageUrl:z.string().url().optional(),
  store:      z.string().max(100).optional(),
  barcode:    z.number().int().positive().optional(),
  notes:      z.string().max(500).optional(),
});

export const updateFunkoSchema = createFunkoSchema.partial();

// Query schema — filtros de variantes generados dinámicamente
const variantQueryFields = Object.fromEntries(
  VARIANT_KEYS.map(k => [k, z.enum(['true', 'false']).optional()])
);

export const funkoQuerySchema = z.object({
  series:  z.string().optional(),
  search:  z.string().optional(),
  ...variantQueryFields,
  page:    z.string().default('1').transform(Number),
  limit:   z.string().default('20').transform(Number),
  sort:    z.enum(['name', 'funkoId', 'createdAt']).default('funkoId'),
  order:   z.enum(['asc', 'desc']).default('asc'),
});

export type CreateFunkoDto = z.infer<typeof createFunkoSchema>;
export type UpdateFunkoDto = z.infer<typeof updateFunkoSchema>;
export type FunkoQueryDto  = z.infer<typeof funkoQuerySchema>;
