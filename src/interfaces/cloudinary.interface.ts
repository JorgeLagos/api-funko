/** Parámetros tipados para CloudinaryStorage (multer-storage-cloudinary) */
export interface CloudinaryParams {
  folder: string;
  allowed_formats: string[];
  transformation: Record<string, unknown>[];
}

/** Extensión del File de Multer con la URL pública de Cloudinary */
export interface CloudinaryFile extends Express.Multer.File {
  path: string;
}
