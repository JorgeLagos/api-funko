import { Router } from 'express';
import { verifyToken } from '../../middleware/auth.middleware';
import {
  getMyCollection,
  addSeries,
  removeSeries,
  getChecklist,
  setFunkoStatus,
  resetFunkos,
} from './collection.controller';

const router = Router();

// Todas las rutas requieren estar logueado
router.use(verifyToken);

router.get('/',                                  getMyCollection);
router.post('/:seriesId',                        addSeries);
router.delete('/:seriesId',                      removeSeries);
router.get('/:slug/checklist',                   getChecklist);
router.put('/:seriesId/funkos/:funkoId',         setFunkoStatus);
router.put('/:seriesId/reset',                   resetFunkos);

export const collectionRoutes = router;
