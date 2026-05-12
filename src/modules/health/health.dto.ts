export interface MemoryUsageDto {
  heapUsed: string;
  heapTotal: string;
}

export interface HealthResponseDto {
  status:      'ok' | 'degraded';
  uptime:      number;
  timestamp:   string;
  mongodb:     string;
  memoryUsage: MemoryUsageDto;
}
