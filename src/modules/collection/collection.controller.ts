import { Request, Response } from 'express';
import * as collectionService from './collection.service';
import { asyncHandler } from '../../middleware/async-handler';

/** GET /api/collection → mis series con progreso */
export const getMyCollection = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.authUser!.id;
  const data = await collectionService.getUserCollection(userId);
  res.json({ success: true, data });
});

/** POST /api/collection/:seriesId → agregar serie */
export const addSeries = asyncHandler(async (req: Request, res: Response) => {
  const userId   = req.authUser!.id;
  const seriesId = req.params['seriesId'] as string;
  const data = await collectionService.addSeriesToCollection(userId, seriesId);
  res.status(201).json({ success: true, data });
});

/** DELETE /api/collection/:seriesId → quitar serie */
export const removeSeries = asyncHandler(async (req: Request, res: Response) => {
  const userId   = req.authUser!.id;
  const seriesId = req.params['seriesId'] as string;
  await collectionService.removeSeriesFromCollection(userId, seriesId);
  res.json({ success: true, message: 'Serie eliminada de tu colección' });
});

/** GET /api/collection/:slug/checklist → funkos de una serie con estado owned */
export const getChecklist = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.authUser!.id;
  const slug   = req.params['slug'] as string;
  const data   = await collectionService.getSeriesChecklist(userId, slug);
  res.json({ success: true, data });
});

/** PUT /api/collection/:seriesId/funkos/:funkoId → toggle owned */
export const toggleFunko = asyncHandler(async (req: Request, res: Response) => {
  const userId   = req.authUser!.id;
  const seriesId = req.params['seriesId'] as string;
  const funkoId  = req.params['funkoId']  as string;
  const data = await collectionService.toggleFunkoOwned(userId, seriesId, funkoId);
  res.json({ success: true, data });
});

/** PUT /api/collection/:seriesId/reset → desmarcar todos los funkos */
export const resetFunkos = asyncHandler(async (req: Request, res: Response) => {
  const userId   = req.authUser!.id;
  const seriesId = req.params['seriesId'] as string;
  const data = await collectionService.resetSeriesFunkos(userId, seriesId);
  res.json({ success: true, data });
});
