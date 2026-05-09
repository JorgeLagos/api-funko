import { Types } from 'mongoose';
import { UserCollection } from '../../models/user-collection.model';
import { Series } from '../../models/series.model';
import { Funko } from '../../models/funko.model';

/** Obtiene todas las series del usuario con progreso (owned/total) */
export async function getUserCollection(userId: string) {
  const entries = await UserCollection.find({ userId })
    .populate('seriesId', 'name slug imageUrl')
    .lean();

  // Para cada serie, obtener el total de funkos
  const result = await Promise.all(
    entries.map(async (entry) => {
      const seriesId = entry.seriesId as any;
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
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return entry;
}

/** Elimina una serie de la colección del usuario */
export async function removeSeriesFromCollection(userId: string, seriesId: string) {
  await UserCollection.deleteOne({ userId, seriesId });
}

/** Obtiene los Funkos de una serie con el estado owned del usuario */
export async function getSeriesChecklist(userId: string, seriesSlug: string) {
  const series = await Series.findOne({ slug: seriesSlug });
  if (!series) throw new Error('Serie no encontrada');

  // Funkos del catálogo global (del admin)
  const funkos = await Funko.find({ series: series._id })
    .select('funkoId name imageUrl variants type store')
    .sort({ funkoId: 1 })
    .lean();

  // Estado personal del usuario para esta serie
  const entry = await UserCollection.findOne({
    userId,
    seriesId: series._id,
  }).lean();

  const ownedSet = new Set(
    (entry?.ownedFunkos ?? []).map((id) => id.toString())
  );

  // Combina: cada funko tiene owned: true/false según el usuario
  const checklist = funkos.map((f) => ({
    ...f,
    owned: ownedSet.has((f._id as Types.ObjectId).toString()),
  }));

  return { series, checklist, ownedCount: ownedSet.size, totalCount: funkos.length };
}

/** Toggle: marca o desmarca un Funko como owned para el usuario */
export async function toggleFunkoOwned(userId: string, seriesId: string, funkoId: string) {
  const entry = await UserCollection.findOne({ userId, seriesId });
  if (!entry) throw new Error('Serie no en tu colección');

  const funkoObjId = new Types.ObjectId(funkoId);
  const alreadyOwned = entry.ownedFunkos.some((id) => id.equals(funkoObjId));

  if (alreadyOwned) {
    entry.ownedFunkos = entry.ownedFunkos.filter((id) => !id.equals(funkoObjId));
  } else {
    entry.ownedFunkos.push(funkoObjId);
  }

  await entry.save();
  return { owned: !alreadyOwned, funkoId, ownedCount: entry.ownedFunkos.length };
}

/** Resetea todos los funkos owned de una serie (desmarca todos) */
export async function resetSeriesFunkos(userId: string, seriesId: string) {
  const entry = await UserCollection.findOne({ userId, seriesId });
  if (!entry) throw new Error('Serie no en tu colección');
  entry.ownedFunkos = [];
  await entry.save();
  return { ownedCount: 0 };
}
