import { IFunko } from '../models/funko.model';

/** Metadata de paginación estándar */
export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Resultado paginado de Funkos */
export interface PaginatedResult {
  data: IFunko[];
  meta: PaginatedMeta;
}
