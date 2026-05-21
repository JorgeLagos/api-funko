import { Request, Response, NextFunction } from 'express';

/** Firma de un handler async de Express (para el asyncHandler wrapper) */
export type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<void>;
