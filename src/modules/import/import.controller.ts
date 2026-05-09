import { Request, Response } from 'express';
import { importService } from './import.service';
import { apiResponse } from '../../utils/api-response';
import { ValidationError } from '../../errors/app-error';

export class ImportController {
  /** POST /api/import/xlsx — importa a una serie existente via filePath */
  async importXlsx(req: Request, res: Response) {
    const { filePath, seriesId } = req.body;
    if (!filePath || !seriesId) throw new ValidationError('filePath y seriesId son requeridos');

    const result = await importService.importFromXlsx(filePath, seriesId);
    apiResponse({
      res,
      data: result,
      message: `Importación completada: ${result.created} creados, ${result.updated} actualizados`,
    });
  }
}

export const importController = new ImportController();
