import { Request, Response } from 'express';
import { funkoService } from './funko.service';
import { FunkoQueryDto } from './funko.dto';
import { apiResponse } from '../../utils/api-response';

export class FunkoController {
  async findAll(req: Request, res: Response) {
    const query = (res.locals.query || req.query) as FunkoQueryDto;
    const result = await funkoService.findAll(query);
    apiResponse({ res, data: result.data, meta: result.meta });
  }

  async findById(req: Request, res: Response) {
    const funko = await funkoService.findById(req.params.id as string);
    apiResponse({ res, data: funko });
  }

  async create(req: Request, res: Response) {
    const funko = await funkoService.create(req.body);
    apiResponse({ res, statusCode: 201, data: funko, message: 'Funko creado exitosamente' });
  }

  async update(req: Request, res: Response) {
    const funko = await funkoService.update(req.params.id as string, req.body);
    apiResponse({ res, data: funko, message: 'Funko actualizado exitosamente' });
  }

  async delete(req: Request, res: Response) {
    await funkoService.delete(req.params.id as string);
    apiResponse({ res, message: 'Funko eliminado exitosamente' });
  }

  async uploadImage(req: Request, res: Response) {
    if (!req.file) {
      apiResponse({ res, statusCode: 400, message: 'No se proporcionó una imagen' });
      return;
    }
    const funko = await funkoService.uploadImage(req.params.id as string, req.file);
    apiResponse({ res, data: funko, message: 'Imagen subida exitosamente' });
  }

  async getStats(_req: Request, res: Response) {
    const stats = await funkoService.getStats();
    apiResponse({ res, data: stats });
  }
}

export const funkoController = new FunkoController();
