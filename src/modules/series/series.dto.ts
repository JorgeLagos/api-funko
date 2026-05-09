import { z } from 'zod';

const toSlug = (name: string) =>
  name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const createSeriesSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  slug: z.string().max(100).optional(),
  imageUrl: z.string().url('URL de imagen inválida').optional(),
}).transform((data) => ({
  ...data,
  slug: data.slug || toSlug(data.name),
}));

export const updateSeriesSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z.string().max(100).optional(),
  imageUrl: z.string().url().optional(),
}).transform((data) => ({
  ...data,
  ...(data.name && !data.slug ? { slug: toSlug(data.name) } : {}),
}));

export type CreateSeriesDto = z.infer<typeof createSeriesSchema>;
export type UpdateSeriesDto = z.infer<typeof updateSeriesSchema>;
