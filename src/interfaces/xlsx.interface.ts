/** Fila cruda del Excel antes de procesamiento */
export interface RawFunkoRow {
  funkoId: number;
  barcode: number;
  name: string;
  isChase: boolean;
  isGlow: boolean;
  isFlocked: boolean;
  isMetallic: boolean;
  isDiamond: boolean;
  isScented: boolean;
  type?: string;
  image?: string;
  boxs?: string;
  store?: string;
}

/** Variante procesada con flags booleanos */
export interface ParsedFunkoVariant {
  isChase: boolean;
  isGlow: boolean;
  isFlocked: boolean;
  isMetallic: boolean;
  isDiamond: boolean;
  isScented: boolean;
}

/** Funko procesado listo para insertar en la DB */
export interface ParsedFunko {
  funkoId: number;
  name: string;
  type: string;
  barcode?: number;
  store?: string;
  hasImage: boolean;
  hasBox: boolean;
  variants: ParsedFunkoVariant[];
}
