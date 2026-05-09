import rateLimit from 'express-rate-limit';

const isDev = process.env.NODE_ENV !== 'production';

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,          // ventana de 1 minuto
  max: isDev ? 500 : 120,            // 500 req/min en dev · 120 req/min en prod
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiadas solicitudes. Intenta de nuevo en 1 minuto.',
  },
});
