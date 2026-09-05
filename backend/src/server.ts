import { app } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/db.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  try {
    // Attempt database connection
    await connectDatabase();

    const server = app.listen(env.PORT, () => {
      logger.info(`Urban Ledger Backend API running on port ${env.PORT} [${env.NODE_ENV}]`);
      logger.info(`Health check: http://localhost:${env.PORT}/api/health`);
    });

    const shutdown = () => {
      logger.info('Shutting down server gracefully...');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
