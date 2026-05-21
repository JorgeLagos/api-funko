import { Store, IStore } from '../../models/store.model';
import { Funko } from '../../models/funko.model';
import { CreateStoreDto, UpdateStoreDto } from './store.dto';
import { NotFoundError, ConflictError } from '../../errors/app-error';

export class StoreService {
  async findAll(): Promise<IStore[]> {
    return Store.find().populate('funkoCount').sort({ name: 1 }).lean() as unknown as IStore[];
  }

  async findById(id: string): Promise<IStore> {
    const store = await Store.findById(id).populate('funkoCount').lean();
    if (!store) throw new NotFoundError('Tienda');
    return store;
  }

  async create(data: CreateStoreDto): Promise<IStore> {
    const exists = await Store.findOne({ $or: [{ name: data.name }, { slug: data.slug }] });
    if (exists) throw new ConflictError('Ya existe una tienda con ese nombre o slug');
    return Store.create(data);
  }

  async update(id: string, data: UpdateStoreDto): Promise<IStore> {
    const store = await Store.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });

    if (!store) throw new NotFoundError('Tienda');
    return store;
  }

  async delete(id: string): Promise<void> {
    const funkoCount = await Funko.countDocuments({ store: id });
    if (funkoCount > 0) {
      throw new ConflictError(`No se puede eliminar: la tienda tiene ${funkoCount} funkos asociados`);
    }
    const store = await Store.findByIdAndDelete(id);
    if (!store) throw new NotFoundError('Tienda');
  }

  /** Busca o crea una tienda por nombre (útil para la ingesta del RPA) */
  async findOrCreate(name: string): Promise<IStore> {
    let store = await Store.findOne({ name });
    if (!store) {
      const slug = name.toLowerCase().normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      store = await Store.create({ name, slug, color: '#1a1a2e', textColor: '#ffffff' });
    }
    return store;
  }
}

export const storeService = new StoreService();
