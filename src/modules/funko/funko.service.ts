import { Funko, IFunko } from '../../models/funko.model';
import { Series } from '../../models/series.model';
import { CreateFunkoDto, UpdateFunkoDto, FunkoQueryDto } from './funko.dto';
import { NotFoundError } from '../../errors/app-error';
import { v4 as uuidv4 } from 'uuid';
import { VARIANT_KEYS } from '../../config/variants.config';
import { cloudinary } from '../../config/cloudinary';

interface PaginatedResult {
  data: IFunko[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class FunkoService {
  async findAll(query: FunkoQueryDto): Promise<PaginatedResult> {
    const filter: Record<string, any> = {};

    // Filtrar por serie (usando slug)
    if (query.series) {
      const series = await Series.findOne({ slug: query.series });
      if (series) {
        filter.series = series._id;
      } else {
        return { data: [], meta: { page: 1, limit: query.limit, total: 0, totalPages: 0 } };
      }
    }

    // Búsqueda por nombre
    if (query.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }

    // Filtros de variantes — generados dinámicamente desde el config
    const q = query as Record<string, unknown>;
    for (const key of VARIANT_KEYS) {
      if (q[key] === 'true') filter[`variants.${key}`] = true;
    }

    // Paginación
    const page = Math.max(1, query.page);
    const limit = Math.min(100, Math.max(1, query.limit));
    const skip = (page - 1) * limit;

    // Ordenamiento
    const sortObj: Record<string, 1 | -1> = {};
    sortObj[query.sort] = query.order === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
      Funko.find(filter).populate('series', 'name slug').sort(sortObj).skip(skip).limit(limit).lean(),
      Funko.countDocuments(filter),
    ]);

    return {
      data: data as IFunko[],
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<IFunko> {
    const funko = await Funko.findById(id).populate('series', 'name slug').lean();
    if (!funko) throw new NotFoundError('Funko');
    return funko as IFunko;
  }

  async create(data: CreateFunkoDto): Promise<IFunko> {
    return Funko.create(data);
  }

  async update(id: string, data: UpdateFunkoDto): Promise<IFunko> {
    const funko = await Funko.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate(
      'series',
      'name slug'
    );
    if (!funko) throw new NotFoundError('Funko');
    return funko;
  }

  async delete(id: string): Promise<void> {
    const funko = await Funko.findByIdAndDelete(id);
    if (!funko) throw new NotFoundError('Funko');

    // Eliminar imagen de Cloudinary si existe
    if (funko.imageUrl && funko.imageUrl.includes('cloudinary')) {
      const publicId = funko.imageUrl
        .split('/upload/')[1]
        ?.replace(/^v\d+\//, '')
        ?.replace(/\.[^/.]+$/, '');
      if (publicId) {
        try { await cloudinary.uploader.destroy(publicId); } catch { }
      }
    }
  }

  async uploadImage(id: string, file: Express.Multer.File): Promise<IFunko> {
    const funko = await Funko.findById(id);
    if (!funko) throw new NotFoundError('Funko');

    // Eliminar imagen anterior de Cloudinary si existe
    if (funko.imageUrl && funko.imageUrl.includes('cloudinary')) {
      const publicId = funko.imageUrl
        .split('/upload/')[1]
        ?.replace(/^v\d+\//, '')
        ?.replace(/\.[^/.]+$/, '');
      if (publicId) {
        try { await cloudinary.uploader.destroy(publicId); } catch { }
      }
    }

    // Cloudinary ya subió la imagen — req.file.path contiene la URL pública
    funko.imageUrl = (file as any).path;
    await funko.save();
    await funko.populate('series', 'name slug');
    return funko;
  }

  async getStats() {
    const [totalFunkos, seriesStats] = await Promise.all([
      Funko.countDocuments(),
      Funko.aggregate([
        {
          $group: {
            _id: '$series',
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'series',
            localField: '_id',
            foreignField: '_id',
            as: 'seriesInfo',
          },
        },
        { $unwind: '$seriesInfo' },
        {
          $project: {
            _id: 0,
            series: '$seriesInfo.name',
            slug: '$seriesInfo.slug',
            total: '$count',
          },
        },
        { $sort: { total: -1 } },
      ]),
    ]);

    return {
      totalFunkos,
      bySeriesStats: seriesStats,
    };
  }
}

export const funkoService = new FunkoService();
