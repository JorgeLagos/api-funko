import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from '../config/cloudinary';
import { ValidationError } from '../errors/app-error';

// dev/ en desarrollo, prod/ en producción
const envPrefix = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

const imageFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
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
  } as any,
});

export const uploadFunkoImage = multer({
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
  } as any,
});

export const uploadSeriesImage = multer({
  storage:    seriesStorage,
  fileFilter: imageFilter,
  limits:     { fileSize: 5 * 1024 * 1024 },
}).single('image');
