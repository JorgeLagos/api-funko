import { Response } from 'express';

/** Opciones para la respuesta API estandarizada */
export interface ApiResponseOptions<T> {
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
