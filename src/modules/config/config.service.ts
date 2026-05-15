/**
 * Servicio del módulo Config.
 * Fuente de verdad para tipos y variantes de Funkos.
 *
 * Para agregar o quitar un tipo/variante, edita SOLO este archivo.
 */

import { ConfigResponseDto, FunkoTypeDto, FunkoVariantDto } from './config.dto';

// ─── Tipos de Funko ───────────────────────────────────────────────────────────

const FUNKO_TYPES: FunkoTypeDto[] = [
  { key: 'pop', label: 'Pop!' },
  { key: 'popMoment', label: 'Pop! Moment' },
  { key: 'popRides', label: 'Pop! Rides' },
  { key: 'popDeluxe', label: 'Pop! Deluxe' },
  { key: 'popTown', label: 'Pop! Town' },
  { key: 'popPlus', label: 'Pop! Plus' },
  { key: 'popSuper', label: 'Pop! Super' },
  { key: 'popJumbo', label: 'Pop! Jumbo' },
];

// ─── Variantes especiales ─────────────────────────────────────────────────────

const FUNKO_VARIANTS: FunkoVariantDto[] = [
  { key: 'isChase', label: 'Chase', color: '#FFB300' },
  { key: 'isGlow', label: 'GITD', color: '#39FF14' },
  { key: 'isFlocked', label: 'Flocked', color: '#9B59B6' },
  { key: 'isMetallic', label: 'Metallic', color: '#A8A9AD' },
  { key: 'isDiamond', label: 'Diamond', color: '#67E8F9' },
  { key: 'isScented', label: 'Scented', color: '#5B9E7D' },
  { key: 'isChrome', label: 'Chrome', color: '#C0C0C0' },
];

// ─── Servicio ─────────────────────────────────────────────────────────────────

export class ConfigService {
  getConfig(): ConfigResponseDto {
    return {
      types: FUNKO_TYPES,
      variants: FUNKO_VARIANTS,
    };
  }
}

export const configService = new ConfigService();
