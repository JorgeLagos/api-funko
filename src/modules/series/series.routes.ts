import { Router } from 'express';
import { seriesController } from './series.controller';
import { asyncHandler } from '../../middleware/async-handler';
import { validate } from '../../middleware/validation';
import { verifyToken, requireRole } from '../../middleware/auth.middleware';
import { uploadSeriesImage } from '../../middleware/upload';
import { createSeriesSchema, updateSeriesSchema } from './series.dto';

const router = Router();

router.get('/', asyncHandler(seriesController.findAll));
router.get('/:id', asyncHandler(seriesController.findById));
router.post('/', validate(createSeriesSchema), asyncHandler(seriesController.create));
router.put('/:id', validate(updateSeriesSchema), asyncHandler(seriesController.update));
router.delete('/:id', asyncHandler(seriesController.delete));
router.post('/:id/image', verifyToken, requireRole('admin'), uploadSeriesImage, asyncHandler(seriesController.uploadImage));

export const seriesRoutes = router;
