import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI es requerido'),
  FRONTEND_URL: z.string().default('http://localhost:4200'),
  BACKEND_URL:  z.string().default('http://localhost:3000'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  // Auth
  GOOGLE_CLIENT_ID:     z.string().min(1, 'GOOGLE_CLIENT_ID es requerido'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET es requerido'),
  JWT_SECRET:           z.string().min(16, 'JWT_SECRET debe tener al menos 16 caracteres'),
  ADMIN_EMAIL:          z.string().email().optional(),
  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME es requerido'),
  CLOUDINARY_API_KEY:    z.string().min(1, 'CLOUDINARY_API_KEY es requerido'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET es requerido'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Variables de entorno inválidas:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
