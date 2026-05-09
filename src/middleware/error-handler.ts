import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { logger } from '../config/logger';
import { env } from '../config/env';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Si es un error operacional (esperado), usar su status
  if (err instanceof AppError) {
    logger.warn(`[${err.statusCode}] ${err.message}`);
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    logger.warn(`[400] Mongoose ValidationError: ${err.message}`);
    res.status(400).json({
      success: false,
      message: 'Error de validación',
      details: err.message,
    });
    return;
  }

  // Error de cast de Mongoose (ObjectId inválido)
  if (err.name === 'CastError') {
    logger.warn(`[400] CastError: ${err.message}`);
    res.status(400).json({
      success: false,
      message: 'ID inválido',
    });
    return;
  }

  // Error de duplicado de MongoDB (código 11000)
  if ((err as any).code === 11000) {
    logger.warn(`[409] Duplicate key: ${err.message}`);
    res.status(409).json({
      success: false,
      message: 'El registro ya existe',
    });
    return;
  }

  // Error no esperado — loggear completo pero no exponer al cliente
  logger.error('Error no controlado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
