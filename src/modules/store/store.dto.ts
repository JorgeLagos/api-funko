import { z } from 'zod';

const toSlug = (name: string) =>
  name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const hexColor = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'Debe ser un color hexadecimal válido (ej: #ff0000)');

export const createStoreSchema = z.object({
  name:      z.string().min(1, 'El nombre es requerido').max(100),
  slug:      z.string().max(100).optional(),
  color:     hexColor.optional(),
  textColor: hexColor.optional(),
  imageUrl:  z.string().url('URL inválida').optional().or(z.literal('')),
}).transform((data) => ({
  ...data,
  slug:      data.slug || toSlug(data.name),
  color:     data.color     || '#1a1a2e',
  textColor: data.textColor || '#ffffff',
  imageUrl:  data.imageUrl  || undefined,
}));

export const updateStoreSchema = z.object({
  name:      z.string().min(1).max(100).optional(),
  slug:      z.string().max(100).optional(),
  color:     hexColor.optional(),
  textColor: hexColor.optional(),
  imageUrl:  z.string().url('URL inválida').optional().or(z.literal('')),
}).transform((data) => ({
  ...data,
  ...(data.name && !data.slug ? { slug: toSlug(data.name) } : {}),
  imageUrl: data.imageUrl || undefined,
}));

export type CreateStoreDto = z.infer<typeof createStoreSchema>;
export type UpdateStoreDto = z.infer<typeof updateStoreSchema>;
