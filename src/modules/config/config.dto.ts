/**
 * DTOs del módulo Config.
 * Define las interfaces de los datos que expone GET /api/config.
 */

export interface FunkoTypeDto {
  key:   string;
  label: string;
  /** Etiqueta corta para el ribbon (ej: "PLUS", "PREMIUM"). Si es null, no se muestra ribbon */
  ribbonLabel?: string | null;
  /** Color de fondo del ribbon */
  ribbonColor?: string | null;
  /** Color de texto del ribbon (default: #fff) */
  ribbonTextColor?: string | null;
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
