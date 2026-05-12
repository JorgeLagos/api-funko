import mongoose from 'mongoose';
import { HealthResponseDto } from './health.dto';

const DB_STATES: Record<number, string> = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

export class HealthService {
  getHealth(): { statusCode: number; body: HealthResponseDto } {
    const dbState = mongoose.connection.readyState;
    const isUp = dbState === 1;
    const mem = process.memoryUsage();

    return {
      statusCode: isUp ? 200 : 503,
      body: {
        status: isUp ? 'ok' : 'degraded',
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        mongodb: DB_STATES[dbState] ?? 'unknown',
        memoryUsage: {
          heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(mem.heapTotal / 1024 / 1024)}MB`,
        },
      },
    };
  }
}

export const healthService = new HealthService();
