import { Router } from 'express';
import { storeController } from './store.controller';
import { asyncHandler } from '../../middleware/async-handler';
import { validate } from '../../middleware/validation';
import { createStoreSchema, updateStoreSchema } from './store.dto';

const router = Router();

router.get('/', asyncHandler(storeController.findAll));
router.get('/:id', asyncHandler(storeController.findById));
router.post('/', validate(createStoreSchema), asyncHandler(storeController.create));
router.put('/:id', validate(updateStoreSchema), asyncHandler(storeController.update));
router.delete('/:id', asyncHandler(storeController.delete));

export const storeRoutes = router;
