import { Router } from 'express';
import { importController } from './import.controller';
import { asyncHandler } from '../../middleware/async-handler';

const router = Router();

router.post('/xlsx', asyncHandler(importController.importXlsx));

export const importRoutes = router;
