import { z } from 'zod';

// Schema de variante flexible: acepta cualquier clave booleana
const variantSchema = z.record(z.string(), z.boolean());

export const createFunkoSchema = z.object({
  funkoId:    z.number().int().positive('FunkoId debe ser positivo'),
  name:       z.string().min(1, 'El nombre es requerido').max(200),
  type:       z.string().max(50).default('Pop'),
  series:     z.string().regex(/^[a-f\d]{24}$/i, 'ID de serie inválido'),
  variants:   variantSchema.optional().default({}),
  imageUrl:   z.string().url().optional(),
  boxImageUrl:z.string().url().optional(),
  store:      z.string().max(100).nullable().optional(),
  barcode:    z.number().int().positive().optional(),
  notes:      z.string().max(500).optional(),
});

export const updateFunkoSchema = createFunkoSchema.partial();

export const funkoQuerySchema = z.object({
  series:  z.string().optional(),
  search:  z.string().optional(),
  page:    z.string().default('1').transform(Number),
  limit:   z.string().default('20').transform(Number),
  sort:    z.enum(['name', 'funkoId', 'createdAt']).default('funkoId'),
  order:   z.enum(['asc', 'desc']).default('asc'),
}).passthrough(); // permite filtros de variantes dinámicas (isChase, isChrome, etc.)

export type CreateFunkoDto = z.infer<typeof createFunkoSchema>;
export type UpdateFunkoDto = z.infer<typeof updateFunkoSchema>;
export type FunkoQueryDto  = z.infer<typeof funkoQuerySchema>;
