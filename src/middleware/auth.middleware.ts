import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRole } from '../models/user.model';
import { JwtPayload } from '../interfaces';

/** Verifica el JWT en el header Authorization: Bearer <token> */
export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Token no proporcionado' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.authUser = payload;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Token inválido o expirado' });
  }
};

/** Middleware de rol: uso → requireRole('admin') */
export const requireRole = (...roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.authUser) {
      res.status(401).json({ success: false, message: 'No autenticado' });
      return;
    }

    if (!roles.includes(req.authUser.role)) {
      res.status(403).json({ success: false, message: 'Acceso denegado: permisos insuficientes' });
      return;
    }

    next();
  };
