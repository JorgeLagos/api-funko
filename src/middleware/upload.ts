import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from '../config/cloudinary';
import { Request, RequestHandler } from 'express';
import { ValidationError } from '../errors/app-error';
import { CloudinaryParams } from '../interfaces';

// dev/ en desarrollo, prod/ en producción
const envPrefix = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

const imageFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ValidationError('Solo se permiten imágenes (JPEG, PNG, WebP, GIF)'));
  }
};

// ── Imágenes de Funko ──────────────────────────────────────────────────────────
const funkoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          `${envPrefix}/api-funko/funkos`,
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation:  [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
  } as unknown as CloudinaryParams,
});

export const uploadFunkoImage: RequestHandler = multer({
  storage:    funkoStorage,
  fileFilter: imageFilter,
  limits:     { fileSize: 5 * 1024 * 1024 },
}).single('image');

// ── Imágenes de Series ─────────────────────────────────────────────────────────
const seriesStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          `${envPrefix}/api-funko/series`,
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation:  [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
  } as unknown as CloudinaryParams,
});

export const uploadSeriesImage: RequestHandler = multer({
  storage:    seriesStorage,
  fileFilter: imageFilter,
  limits:     { fileSize: 5 * 1024 * 1024 },
}).single('image');
