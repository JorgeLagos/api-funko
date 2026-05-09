import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  } catch (error) {
    logger.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1);
  }

  mongoose.connection.on('connected', () => {
    logger.info('✅ MongoDB conectado correctamente');
  });

  mongoose.connection.on('error', (err) => {
    logger.error('❌ Error de conexión MongoDB:', err);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('⚠️ MongoDB desconectado — Mongoose intentará reconectar automáticamente');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('🔄 MongoDB reconectado exitosamente');
  });
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.connection.close();
  logger.info('🔌 Conexión a MongoDB cerrada');
};
