import { Request, Response } from 'express';
import { IUser } from '../../models/user.model';
import { generateToken } from './auth.utils';
import { env } from '../../config/env';

/** Callback tras OAuth exitoso → genera JWT y redirige al frontend */
export const googleCallback = (req: Request, res: Response): void => {
  const user = req.user as IUser;
  const token = generateToken(user);

  const redirectUrl = `${env.FRONTEND_URL}/auth/callback?token=${token}`;
  console.log('🔁 FRONTEND_URL en runtime:', env.FRONTEND_URL);
  console.log('🔁 Redirigiendo a:', redirectUrl.substring(0, 80) + '...');

  // Redirige al frontend con el token en query param (el frontend lo almacena)
  res.redirect(redirectUrl);
};

/** GET /auth/me → devuelve el usuario logueado */
export const getMe = (req: Request, res: Response): void => {
  res.json({ success: true, data: req.authUser });
};

/** POST /auth/logout → solo responde OK (el frontend elimina el token) */
export const logout = (_req: Request, res: Response): void => {
  res.json({ success: true, message: 'Sesión cerrada correctamente' });
};
