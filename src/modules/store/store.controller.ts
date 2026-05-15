import { Request, Response } from 'express';
import { storeService } from './store.service';
import { apiResponse } from '../../utils/api-response';

export class StoreController {
  async findAll(_req: Request, res: Response) {
    const stores = await storeService.findAll();
    apiResponse({ res, data: stores });
  }

  async findById(req: Request, res: Response) {
    const store = await storeService.findById(req.params.id as string);
    apiResponse({ res, data: store });
  }

  async create(req: Request, res: Response) {
    const store = await storeService.create(req.body);
    apiResponse({ res, statusCode: 201, data: store, message: 'Tienda creada exitosamente' });
  }

  async update(req: Request, res: Response) {
    const store = await storeService.update(req.params.id as string, req.body);
    apiResponse({ res, data: store, message: 'Tienda actualizada exitosamente' });
  }

  async delete(req: Request, res: Response) {
    await storeService.delete(req.params.id as string);
    apiResponse({ res, message: 'Tienda eliminada exitosamente' });
  }
}

export const storeController = new StoreController();
