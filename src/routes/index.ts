import { Router } from 'express';
import { healthRoutes }     from '../modules/health/health.routes';
import { seriesRoutes }     from '../modules/series/series.routes';
import { funkoRoutes }      from '../modules/funko/funko.routes';
import { collectionRoutes } from '../modules/collection/collection.routes';
import { configRoutes }     from '../modules/config/config.routes';

const router = Router();

router.use('/health',     healthRoutes);
router.use('/series',     seriesRoutes);
router.use('/funkos',     funkoRoutes);
router.use('/collection', collectionRoutes);
router.use('/config',     configRoutes);

export const apiRoutes = router;
