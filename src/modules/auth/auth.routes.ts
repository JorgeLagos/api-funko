import { Router } from 'express';
import passport from '../../config/passport';
import { googleCallback, getMe, logout } from './auth.controller';
import { verifyToken } from '../../middleware/auth.middleware';

const router = Router();

/** Inicia el flujo OAuth con Google */
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

/** Google redirige aquí tras autenticar */
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=oauth' }),
  googleCallback
);

/** Retorna el usuario logueado (requiere JWT) */
router.get('/me', verifyToken, getMe);

/** Logout (stateless — el frontend elimina el token) */
router.post('/logout', logout);

export const authRoutes = router;
