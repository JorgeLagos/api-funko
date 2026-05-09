import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from './config/passport';
import { env } from './config/env';
import { logger } from './config/logger';
import { errorHandler } from './middleware/error-handler';
import { apiLimiter } from './middleware/rate-limiter';
import { apiRoutes } from './routes';
import { authRoutes } from './modules/auth/auth.routes';

const app = express();

// --- Seguridad y middlewares globales ---
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (Postman, curl, etc.)
    if (!origin) return callback(null, true);
    // En desarrollo, permitir cualquier localhost
    if (env.NODE_ENV === 'development' && origin.startsWith('http://localhost')) {
      return callback(null, true);
    }
    // En producción, solo el FRONTEND_URL configurado
    if (origin === env.FRONTEND_URL) return callback(null, true);
    callback(new Error('CORS no permitido'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(apiLimiter);

// --- Request logging ---
const morganStream = { write: (message: string) => logger.info(message.trim()) };
app.use(morgan('short', { stream: morganStream }));

// --- Archivos estáticos (imágenes de funkos) ---
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

// --- Ruta raíz ---
app.get('/', (_req, res) => {
  res.json({
    name:    'API Funko',
    version: '1.0.0',
    status:  'online',
    env:     env.NODE_ENV,
    docs:    '/api/health',
  });
});

// --- Rutas Auth (fuera del prefijo /api para OAuth redirect limpio) ---
app.use('/auth', authRoutes);

// --- Rutas API (registro centralizado) ---
app.use('/api', apiRoutes);

// --- 404 handler ---
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

// --- Error handler global (DEBE ir al final) ---
app.use(errorHandler);

export default app;
