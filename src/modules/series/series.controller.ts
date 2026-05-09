import { Request, Response } from 'express';
import { seriesService } from './series.service';
import { apiResponse } from '../../utils/api-response';

export class SeriesController {
  async findAll(_req: Request, res: Response) {
    const series = await seriesService.findAll();
    apiResponse({ res, data: series });
  }

  async findById(req: Request, res: Response) {
    const series = await seriesService.findById(req.params.id as string);
    apiResponse({ res, data: series });
  }

  async create(req: Request, res: Response) {
    const series = await seriesService.create(req.body);
    apiResponse({ res, statusCode: 201, data: series, message: 'Serie creada exitosamente' });
  }

  async update(req: Request, res: Response) {
    const series = await seriesService.update(req.params.id as string, req.body);
    apiResponse({ res, data: series, message: 'Serie actualizada exitosamente' });
  }

  async delete(req: Request, res: Response) {
    await seriesService.delete(req.params.id as string);
    apiResponse({ res, message: 'Serie eliminada exitosamente' });
  }

  async uploadImage(req: Request, res: Response) {
    if (!req.file) { res.status(400).json({ success: false, message: 'No se envió imagen' }); return; }
    const series = await seriesService.uploadImage(req.params.id as string, req.file);
    apiResponse({ res, data: series, message: 'Logo actualizado' });
  }
}

export const seriesController = new SeriesController();
