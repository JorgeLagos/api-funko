import { Response } from 'express';

interface ApiResponseOptions<T> {
  res: Response;
  statusCode?: number;
  success?: boolean;
  message?: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * Transforma recursivamente _id → id en objetos y arrays.
 * También elimina __v de Mongoose.
 */
const transformIds = (value: any): any => {
  // Convertir Mongoose Documents a objetos planos antes de procesar
  if (value !== null && typeof value === 'object' && typeof value.toObject === 'function') {
    value = value.toObject({ virtuals: true });
  }

  if (Array.isArray(value)) {
    return value.map(transformIds);
  }

  if (value !== null && typeof value === 'object') {
    const transformed: any = {};
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
  const response: any = { success };
  if (message) response.message = message;
  if (data !== undefined) response.data = transformIds(data);
  if (meta) response.meta = meta;

  res.status(statusCode).json(response);
};
