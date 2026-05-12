/**
 * DTOs del módulo Config.
 * Define las interfaces de los datos que expone GET /api/config.
 */

export interface FunkoTypeDto {
  key:   string;
  label: string;
  color?: string;
}

export interface FunkoVariantDto {
  key:   string;
  label: string;
  color: string;
}

export interface ConfigResponseDto {
  types:    FunkoTypeDto[];
  variants: FunkoVariantDto[];
}
