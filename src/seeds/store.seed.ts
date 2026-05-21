/**
 * Seed de stickers de tiendas oficiales Funko.
 * Ejecutar: pnpm exec ts-node src/seeds/store.seed.ts
 *
 * Fuentes de colores:
 *  - GameStop:            #FD0000  (brandcolorcode.com / logotyp.us)
 *  - Target:              #CC0000  (brandcolorcode.com / brandpalettes.com)
 *  - Walmart:             #0071CE  (walmart.com / designyourway.net)
 *  - Amazon:              #FFFFFF / #131921  (sticker real: fondo blanco, texto oscuro)
 *  - Hot Topic:           #000000  (logos-world.net — logo negro actual)
 *  - Funko Shop:          #1C1B37  (funko.com — Midnight Navy UI)
 *  - Entertainment Earth: #F7941E  (naranja de su logo/sticker exclusivo)
 *  - BoxLunch:            #2D2D2D  (paleta oscura característica de su marca)
 *  - Specialty Series:    #1a2a6c  (azul con gold — reconocido por coleccionistas)
 */
import mongoose from 'mongoose';
import { env } from '../config/env';
import { Store } from '../models/store.model';

const toSlug = (name: string) =>
  name.toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const STICKERS: { name: string; color: string; textColor: string }[] = [
  { name: 'Entertainment Earth', color: '#F7941E', textColor: '#ffffff' },
  { name: 'Hot Topic',           color: '#000000', textColor: '#ff0099' },
  { name: 'BoxLunch',            color: '#2D2D2D', textColor: '#ffffff' },
  { name: 'Walmart',             color: '#0071CE', textColor: '#ffffff' },
  { name: 'Target',              color: '#CC0000', textColor: '#ffffff' },
  { name: 'Amazon',              color: '#FFFFFF', textColor: '#131921' },
  { name: 'Funko Shop',          color: '#1C1B37', textColor: '#ffffff' },
  { name: 'GameStop',            color: '#FD0000', textColor: '#ffffff' },
  { name: 'Specialty Series',    color: '#1a2a6c', textColor: '#FFD700' },
];

async function seed() {
  await mongoose.connect(env.MONGODB_URI);
  console.log('🔌 Conectado a MongoDB\n');

  // Truncate: limpia la colección antes de reinsertar
  const { deletedCount } = await Store.deleteMany({});
  console.log(`🗑️  Truncate → ${deletedCount} registros eliminados\n`);

  for (const sticker of STICKERS) {
    const slug = toSlug(sticker.name);
    await Store.create({ ...sticker, slug });
    console.log(`  ✅ Creado   → ${sticker.name}`);
  }

  console.log(`\n🏷️  Seed completado — ${STICKERS.length} stickers insertados`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});
