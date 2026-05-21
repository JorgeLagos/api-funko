import { Series, ISeries } from '../../models/series.model';
import { Funko } from '../../models/funko.model';
import { CreateSeriesDto, UpdateSeriesDto } from './series.dto';
import { NotFoundError, ConflictError } from '../../errors/app-error';
import { cloudinary } from '../../config/cloudinary';
import { CloudinaryFile } from '../../interfaces';

export class SeriesService {
  async findAll(): Promise<ISeries[]> {
    return Series.find().populate('funkoCount').sort({ name: 1 }).lean() as unknown as ISeries[];
  }

  async findById(id: string): Promise<ISeries> {
    const series = await Series.findById(id).populate('funkoCount').lean();
    if (!series) throw new NotFoundError('Serie');
    return series;
  }

  async findBySlug(slug: string): Promise<ISeries> {
    const series = await Series.findOne({ slug }).populate('funkoCount').lean();
    if (!series) throw new NotFoundError('Serie');
    return series;
  }

  async create(data: CreateSeriesDto): Promise<ISeries> {
    const exists = await Series.findOne({ $or: [{ name: data.name }, { slug: data.slug }] });
    if (exists) throw new ConflictError('Ya existe una serie con ese nombre o slug');
    return Series.create(data);
  }

  async update(id: string, data: UpdateSeriesDto): Promise<ISeries> {
    const series = await Series.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });

    if (!series) throw new NotFoundError('Serie');
    return series;
  }

  async delete(id: string): Promise<void> {
    const funkoCount = await Funko.countDocuments({ series: id });
    if (funkoCount > 0) {
      throw new ConflictError(`No se puede eliminar: la serie tiene ${funkoCount} funkos asociados`);
    }
    const series = await Series.findByIdAndDelete(id);
    if (!series) throw new NotFoundError('Serie');

    // Eliminar imagen de Cloudinary si existe
    if (series.imageUrl && series.imageUrl.includes('cloudinary')) {
      const publicId = series.imageUrl
        .split('/upload/')[1]             // quita el prefijo base de cloudinary
        ?.replace(/^v\d+\//, '')          // quita la versión (v123456/)
        ?.replace(/\.[^/.]+$/, '');       // quita la extensión
      if (publicId) {
        try { await cloudinary.uploader.destroy(publicId); }
        catch (e) { /* log pero no bloquear el flujo */ }
      }
    }
  }

  async uploadImage(id: string, file: Express.Multer.File): Promise<ISeries> {
    const series = await Series.findById(id);
    if (!series) throw new NotFoundError('Serie');

    // Eliminar imagen anterior de Cloudinary si existe
    if (series.imageUrl && series.imageUrl.includes('cloudinary')) {
      const publicId = series.imageUrl.split('/').slice(-2).join('/').replace(/\.[^/.]+$/, '');
      try { await (await import('../../config/cloudinary')).cloudinary.uploader.destroy(publicId); }
      catch { /* ignorar si falla el borrado */ }
    }

    // Cloudinary ya subió la imagen — req.file.path contiene la URL pública
    series.imageUrl = (file as CloudinaryFile).path;
    await series.save();
    return series;
  }
}

export const seriesService = new SeriesService();
