/**
 * Servicio del módulo Config.
 * Fuente de verdad para tipos y variantes de Funkos.
 *
 * Para agregar o quitar un tipo/variante, edita SOLO este archivo.
 */

import { ConfigResponseDto, FunkoTypeDto, FunkoVariantDto } from './config.dto';

// ─── Tipos de Funko ───────────────────────────────────────────────────────────

const FUNKO_TYPES: FunkoTypeDto[] = [
  { key: 'pop', label: 'Pop!', ribbonLabel: null },
  { key: 'popMoment', label: 'Pop! Moment', ribbonLabel: 'MOMENT', ribbonColor: '#9B8ABF' },
  { key: 'popRides', label: 'Pop! Rides', ribbonLabel: 'RIDES', ribbonColor: '#9B8ABF' },
  { key: 'popDeluxe', label: 'Pop! Deluxe', ribbonLabel: 'DELUXE', ribbonColor: '#9B8ABF' },
  { key: 'popTown', label: 'Pop! Town', ribbonLabel: 'TOWN', ribbonColor: '#9B8ABF' },
  { key: 'popPlus', label: 'Pop! Plus', ribbonLabel: 'PLUS', ribbonColor: '#9B8ABF' },
  { key: 'popSuper', label: 'Pop! Super', ribbonLabel: 'SUPER', ribbonColor: '#9B8ABF' },
  { key: 'popJumbo', label: 'Pop! Jumbo', ribbonLabel: 'JUMBO', ribbonColor: '#9B8ABF' },
  { key: 'popTee', label: 'Pop! & Tee', ribbonLabel: 'TEE', ribbonColor: '#9B8ABF' },
  { key: 'popPremium', label: 'Pop! Premium', ribbonLabel: 'PREMIUM', ribbonColor: '#9B8ABF' },
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
  { key: 'isExclusive', label: 'Exclusive', color: '#FCD24F' },
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
