import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../errors/app-error';

export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const zodError = result.error as ZodError;
      const messages = zodError.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new ValidationError(messages);
    }
    req.body = result.data;
    next();
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const zodError = result.error as ZodError;
      const messages = zodError.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new ValidationError(messages);
    }
    // Express 5 hace req.query read-only, guardamos en res.locals
    res.locals.query = result.data;
    next();
  };
};

