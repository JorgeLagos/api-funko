import { Request, Response } from 'express';
import { configService } from './config.service';

export class ConfigController {
  getConfig(req: Request, res: Response): void {
    const data = configService.getConfig();
    res.json({ success: true, data });
  }
}

export const configController = new ConfigController();
