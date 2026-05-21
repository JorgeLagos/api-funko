import { Request, Response, NextFunction } from 'express';
import { AsyncFn } from '../interfaces';

export const asyncHandler = (fn: AsyncFn) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
