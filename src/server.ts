import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { connectDatabase, disconnectDatabase } from './config/database';

const startServer = async () => {
  // Conectar a MongoDB
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Servidor corriendo en http://localhost:${env.PORT}`);
    logger.info(`📋 Health check: http://localhost:${env.PORT}/api/health`);
    logger.info(`🌍 Entorno: ${env.NODE_ENV}`);
  });

  // --- Graceful Shutdown ---
  const shutdown = async (signal: string) => {
    logger.info(`\n${signal} recibido — cerrando servidor...`);
    server.close(async () => {
      await disconnectDatabase();
      logger.info('✅ Servidor cerrado correctamente');
      process.exit(0);
    });

    // Forzar cierre si tarda más de 10s
    setTimeout(() => {
      logger.error('⚠️ Cierre forzado por timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // --- Errores no controlados ---
  process.on('uncaughtException', (error) => {
    logger.error('❌ Uncaught Exception:', error);
    shutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason) => {
    logger.error('❌ Unhandled Rejection:', reason);
    shutdown('unhandledRejection');
  });
};

startServer();
