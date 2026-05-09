import * as XLSX from 'xlsx';
import path from 'path';
import { logger } from '../config/logger';

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

export interface ParsedFunkoVariant {
  isChase: boolean;
  isGlow: boolean;
  isFlocked: boolean;
  isMetallic: boolean;
  isDiamond: boolean;
  isScented: boolean;
}

export interface ParsedFunko {
  funkoId: number;
  name: string;
  type: string;
  barcode?: number;       // ← A nivel raíz del Funko
  store?: string;
  hasImage: boolean;
  hasBox: boolean;
  variants: ParsedFunkoVariant[];  // ← Solo flags, sin barcode
}

const toBool = (value: any): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return !!value;
};

/** Compara dos variantes para verificar si son idénticas */
const variantKey = (v: ParsedFunkoVariant): string =>
  `${v.isChase}-${v.isGlow}-${v.isFlocked}-${v.isMetallic}-${v.isDiamond}-${v.isScented}`;

export const parseXlsxFile = (filePath: string): ParsedFunko[] => {
  const absolutePath = path.resolve(filePath);
  logger.info(`Parseando archivo Excel: ${absolutePath}`);

  const workbook = XLSX.readFile(absolutePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  // Filtrar filas vacías
  const validRows = rawData.filter(
    (row) => row.funkoId && row.name && String(row.funkoId).trim() !== '' && String(row.name).trim() !== ''
  );

  logger.info(`Filas válidas encontradas: ${validRows.length}`);

  // Agrupar por funkoId + name
  const grouped = new Map<string, ParsedFunko>();

  for (const row of validRows) {
    const funkoId = Number(row.funkoId);
    const barcode = row.barcode ? Number(row.barcode) : undefined;
    const name = String(row.name).trim();
    const key = `${funkoId}-${name}`;

    if (!grouped.has(key)) {
      grouped.set(key, {
        funkoId,
        name,
        type: row.type ? String(row.type).trim() : 'Pop',
        barcode,                // ← Primer barcode encontrado va al Funko
        store: row.tienda ? String(row.tienda).trim() : undefined,
        hasImage: String(row.image).toUpperCase() === 'OK',
        hasBox: String(row.boxs).toUpperCase() === 'OK',
        variants: [],
      });
    }

    const entry = grouped.get(key)!;

    // Solo agregar la variante si tiene algún flag especial activo
    const variant: ParsedFunkoVariant = {
      isChase:    toBool(row.isChase),
      isGlow:     toBool(row.isGlow),
      isFlocked:  toBool(row.isFlocked),
      isMetallic: toBool(row.isMetallic),
      isDiamond:  toBool(row.isDiamond),
      isScented:  toBool(row.isScented),
    };

    const hasSpecialType = variant.isChase || variant.isGlow || variant.isFlocked ||
                           variant.isMetallic || variant.isDiamond || variant.isScented;

    // Solo agregar si es especial y no está duplicada
    if (hasSpecialType) {
      const alreadyExists = entry.variants.some(v => variantKey(v) === variantKey(variant));
      if (!alreadyExists) {
        entry.variants.push(variant);
      }
    }
  }

  const result = Array.from(grouped.values());
  logger.info(`Funkos únicos parseados: ${result.length}`);

  return result;
};
