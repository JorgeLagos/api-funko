import { Router } from 'express';
import { healthRoutes }     from '../modules/health/health.routes';
import { seriesRoutes }     from '../modules/series/series.routes';
import { funkoRoutes }      from '../modules/funko/funko.routes';
import { importRoutes }     from '../modules/import/import.routes';
import { collectionRoutes } from '../modules/collection/collection.routes';

const router = Router();

router.use('/health',     healthRoutes);
router.use('/series',     seriesRoutes);
router.use('/funkos',     funkoRoutes);
router.use('/import',     importRoutes);
router.use('/collection', collectionRoutes);

export const apiRoutes = router;
