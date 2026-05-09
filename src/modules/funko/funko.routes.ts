import { Router } from 'express';
import { funkoController } from './funko.controller';
import { asyncHandler } from '../../middleware/async-handler';
import { validate, validateQuery } from '../../middleware/validation';
import { createFunkoSchema, updateFunkoSchema, funkoQuerySchema } from './funko.dto';
import { uploadFunkoImage } from '../../middleware/upload';

const router = Router();

router.get('/',      validateQuery(funkoQuerySchema), asyncHandler(funkoController.findAll));
router.get('/stats', asyncHandler(funkoController.getStats));
router.get('/:id', asyncHandler(funkoController.findById));
router.post('/', validate(createFunkoSchema), asyncHandler(funkoController.create));
router.put('/:id', validate(updateFunkoSchema), asyncHandler(funkoController.update));
router.delete('/:id', asyncHandler(funkoController.delete));
router.post('/:id/image', uploadFunkoImage, asyncHandler(funkoController.uploadImage));

export const funkoRoutes = router;
