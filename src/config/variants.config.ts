/**
 * Fuente de verdad para las variantes de Funko.
 * Para agregar o quitar una variante, edita SOLO este archivo.
 */

export const VARIANT_KEYS = [
  'isChase',
  'isGlow',
  'isFlocked',
  'isMetallic',
  'isDiamond',
  'isScented',
] as const;

export type VariantKey = (typeof VARIANT_KEYS)[number];

export type VariantsMap = Record<VariantKey, boolean>;

export const VARIANT_DEFAULTS: VariantsMap = {
  isChase: false,
  isGlow: false,
  isFlocked: false,
  isMetallic: false,
  isDiamond: false,
  isScented: false,
};
