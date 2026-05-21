import { ApiResponseOptions } from '../interfaces';

/**
 * Transforma recursivamente _id → id en objetos y arrays.
 * También elimina __v de Mongoose.
 */
const transformIds = (value: unknown): unknown => {
  // Convertir Mongoose Documents a objetos planos antes de procesar
  const hasToObject = (v: unknown): v is { toObject: (opts: Record<string, unknown>) => unknown } =>
    v !== null && typeof v === 'object' && 'toObject' in v && typeof (v as Record<string, unknown>).toObject === 'function';
  if (hasToObject(value)) {
    value = value.toObject({ virtuals: true });
  }

  if (Array.isArray(value)) {
    return value.map(transformIds);
  }

  if (value !== null && typeof value === 'object') {
    const transformed: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      if (key === '_id') {
        transformed['id'] = String(val); // ObjectId → string
      } else if (key === '__v') {
        // omitir campo de versión de Mongoose
      } else {
        transformed[key] = transformIds(val);
      }
    }
    return transformed;
  }

  return value;
};

export const apiResponse = <T>({
  res,
  statusCode = 200,
  success = true,
  message,
  data,
  meta,
}: ApiResponseOptions<T>): void => {
  const response: Record<string, unknown> = { success };
  if (message) response.message = message;
  if (data !== undefined) response.data = transformIds(data);
  if (meta) response.meta = meta;

  res.status(statusCode).json(response);
};
