import { Funko } from '../../models/funko.model';
import { Series } from '../../models/series.model';
import { parseXlsxFile, ParsedFunko } from '../../utils/xlsx-parser';
import { NotFoundError, ValidationError } from '../../errors/app-error';
import { logger } from '../../config/logger';

interface ImportResult {
  seriesName: string;
  seriesId: string;
  totalParsed: number;
  created: number;
  updated: number;
  errors: string[];
}

export class ImportService {
  async importFromXlsx(filePath: string, seriesId: string): Promise<ImportResult> {
    const series = await Series.findById(seriesId);
    if (!series) throw new NotFoundError('Serie');

    let parsedFunkos: ParsedFunko[];
    try {
      parsedFunkos = parseXlsxFile(filePath);
    } catch (error: any) {
      throw new ValidationError(`Error al parsear el archivo Excel: ${error.message}`);
    }

    const result: ImportResult = {
      seriesName: series.name,
      seriesId,
      totalParsed: parsedFunkos.length,
      created: 0,
      updated: 0,
      errors: [],
    };

    for (const parsed of parsedFunkos) {
      try {
        const existing = await Funko.findOne({ funkoId: parsed.funkoId, name: parsed.name, series: seriesId });

        if (existing) {
          if (!existing.barcode && parsed.barcode) existing.barcode = parsed.barcode;
          const pv = parsed.variants?.[0];
          if (pv) {
            existing.variants = {
              isChase:    existing.variants?.isChase    || pv.isChase,
              isGlow:     existing.variants?.isGlow     || pv.isGlow,
              isFlocked:  existing.variants?.isFlocked  || pv.isFlocked,
              isMetallic: existing.variants?.isMetallic || pv.isMetallic,
              isDiamond:  existing.variants?.isDiamond  || pv.isDiamond,
              isScented:  existing.variants?.isScented  || pv.isScented,
            } as any;
          }
          await existing.save();
          result.updated++;
        } else {
          await Funko.create({
            funkoId:  parsed.funkoId,
            name:     parsed.name,
            type:     parsed.type,
            series:   seriesId,
            barcode:  parsed.barcode,
            store:    parsed.store,
            variants: parsed.variants?.[0] ?? {},
          });
          result.created++;
        }
      } catch (error: any) {
        const msg = `Error con Funko #${parsed.funkoId} "${parsed.name}": ${error.message}`;
        logger.warn(msg);
        result.errors.push(msg);
      }
    }

    logger.info(`Import "${series.name}": ${result.created} creados, ${result.updated} actualizados`);
    return result;
  }
}

export const importService = new ImportService();
