import { Request, Response } from 'express';
import { healthService } from './health.service';

export class HealthController {
  /** GET /api/health */
  getHealth(_req: Request, res: Response): void {
    const { statusCode, body } = healthService.getHealth();
    res.status(statusCode).json(body);
  }
}

export const healthController = new HealthController();
