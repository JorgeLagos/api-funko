import mongoose, { Types } from 'mongoose';
import { UserCollection } from '../../models/user-collection.model';
import { Series } from '../../models/series.model';
import { Funko } from '../../models/funko.model';
import { Store } from '../../models/store.model';
import { PopulatedSeries } from '../../interfaces';

export type FunkoStatus = 'owned' | 'notInterested' | 'inStore' | 'none';

/** Obtiene todas las series del usuario con progreso (owned/total) */
export async function getUserCollection(userId: string) {
  const entries = await UserCollection.find({ userId })
    .populate('seriesId', 'name slug imageUrl')
    .lean();

  // Filtra entradas huérfanas donde la serie fue eliminada de la DB
  const validEntries = entries.filter((e) => e.seriesId != null);

  const result = await Promise.all(
    validEntries.map(async (entry) => {
      const seriesId = entry.seriesId as unknown as PopulatedSeries;
      const total = await Funko.countDocuments({ series: seriesId._id });
      return {
        series:     seriesId,
        owned:      entry.ownedFunkos.length,
        total,
        percentage: total > 0 ? Math.round((entry.ownedFunkos.length / total) * 100) : 0,
      };
    })
  );

  return result;
}

/** Agrega una serie a la colección del usuario */
export async function addSeriesToCollection(userId: string, seriesId: string) {
  const series = await Series.findById(seriesId);
  if (!series) throw new Error('Serie no encontrada');

  const entry = await UserCollection.findOneAndUpdate(
    { userId, seriesId },
    { userId, seriesId },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }

  );

  return entry;
}

/** Elimina una serie de la colección del usuario */
export async function removeSeriesFromCollection(userId: string, seriesId: string) {
  await UserCollection.deleteOne({ userId, seriesId });
}

/** Obtiene los Funkos de una serie con el estado del usuario */
export async function getSeriesChecklist(userId: string, seriesSlug: string) {
  const series = await Series.findOne({ slug: seriesSlug });
  if (!series) throw new Error('Serie no encontrada');

  // Funkos del catálogo global (sin populate para evitar CastError)
  const funkos = await Funko.find({ series: series._id })
    .select('funkoId name imageUrl variants type store')
    .sort({ funkoId: 1 })
    .lean();

  // Lookup seguro de stores: solo ObjectIds válidos
  const validStoreIds = [
    ...new Set(
      funkos
        .map(f => f.store)
        .filter(s => s && mongoose.isValidObjectId(s))
        .map(s => String(s))
    ),
  ];

  const storeMap = new Map<string, unknown>();
  if (validStoreIds.length > 0) {
    const stores = await Store.find({ _id: { $in: validStoreIds } })
      .select('name slug color textColor')
      .lean();
    stores.forEach(s => storeMap.set((s._id as Types.ObjectId).toString(), s));
  }

  // Estado personal del usuario para esta serie
  const entry = await UserCollection.findOne({
    userId,
    seriesId: series._id,
  }).lean();

  const ownedSet = new Set(
    (entry?.ownedFunkos ?? []).map((id) => id.toString())
  );
  const notInterestedSet = new Set(
    (entry?.notInterestedFunkos ?? []).map((id) => id.toString())
  );
  const inStoreSet = new Set(
    (entry?.inStoreFunkos ?? []).map((id) => id.toString())
  );

  // Combina: funko + estado + store resuelto (o null si inválido)
  const checklist = funkos.map((f) => {
    const fid = (f._id as Types.ObjectId).toString();
    return {
      ...f,
      owned:         ownedSet.has(fid),
      notInterested: notInterestedSet.has(fid),
      inStore:       inStoreSet.has(fid),
      store: f.store && mongoose.isValidObjectId(f.store)
        ? (storeMap.get(String(f.store)) ?? null)
        : null,
    };
  });

  return {
    series,
    checklist,
    ownedCount:   ownedSet.size,
    inStoreCount: inStoreSet.size,
    totalCount:   funkos.length,
  };
}

/** Establece el estado de un Funko para el usuario (con exclusión mutua) */
export async function setFunkoStatus(
  userId: string,
  seriesId: string,
  funkoId: string,
  status: FunkoStatus
) {
  const entry = await UserCollection.findOne({ userId, seriesId });
  if (!entry) throw new Error('Serie no en tu colección');

  const funkoObjId = new Types.ObjectId(funkoId);

  // Quitar de todos los arrays primero (exclusión mutua)
  entry.ownedFunkos         = entry.ownedFunkos.filter((id) => !id.equals(funkoObjId));
  entry.notInterestedFunkos = (entry.notInterestedFunkos ?? []).filter((id) => !id.equals(funkoObjId));
  entry.inStoreFunkos       = (entry.inStoreFunkos ?? []).filter((id) => !id.equals(funkoObjId));

  // Agregar al array correspondiente
  if (status === 'owned')         entry.ownedFunkos.push(funkoObjId);
  else if (status === 'notInterested') entry.notInterestedFunkos.push(funkoObjId);
  else if (status === 'inStore')  entry.inStoreFunkos.push(funkoObjId);

  await entry.save();

  return {
    status,
    funkoId,
    ownedCount:   entry.ownedFunkos.length,
    inStoreCount: (entry.inStoreFunkos ?? []).length,
  };
}

/** Resetea todos los estados de una serie (desmarca todos) */
export async function resetSeriesFunkos(userId: string, seriesId: string) {
  const entry = await UserCollection.findOne({ userId, seriesId });
  if (!entry) throw new Error('Serie no en tu colección');
  entry.ownedFunkos         = [];
  entry.notInterestedFunkos = [];
  entry.inStoreFunkos       = [];
  await entry.save();
  return { ownedCount: 0, inStoreCount: 0 };
}
