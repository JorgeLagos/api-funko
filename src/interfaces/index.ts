// ── Auth ────────────────────────────────────────────────────────────────────────
export { JwtPayload } from './auth.interface';

// ── Pagination ──────────────────────────────────────────────────────────────────
export { PaginatedMeta, PaginatedResult } from './pagination.interface';

// ── Collection ──────────────────────────────────────────────────────────────────
export { PopulatedSeries } from './collection.interface';

// ── API Response ────────────────────────────────────────────────────────────────
export { ApiResponseOptions } from './api-response.interface';

// ── Cloudinary ──────────────────────────────────────────────────────────────────
export { CloudinaryParams, CloudinaryFile } from './cloudinary.interface';

// ── Express ─────────────────────────────────────────────────────────────────────
export { AsyncFn } from './express.interface';

// ── XLSX Parser ─────────────────────────────────────────────────────────────────
export { RawFunkoRow, ParsedFunkoVariant, ParsedFunko } from './xlsx.interface';

// ── Global augmentations (se importa por side-effect) ───────────────────────────
import './auth.interface';
