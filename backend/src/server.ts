import { app } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/db.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  try {
    // Attempt database connection
    await connectDatabase();

    const server = app.listen(env.PORT, '0.0.0.0', () => {
      logger.info(`Urban Ledger Backend API running on port ${env.PORT} [${env.NODE_ENV}]`);
      logger.info(`Local Access:   http://localhost:${env.PORT}/api/health`);
      try {
        import('node:os').then((os) => {
          const interfaces = os.networkInterfaces();
          for (const name of Object.keys(interfaces)) {
            for (const iface of interfaces[name] || []) {
              if (iface.family === 'IPv4' && !iface.internal) {
                logger.info(`Team LAN Access (Mohith/Rohith/Rugenthra): http://${iface.address}:${env.PORT}/api`);
              }
            }
          }
        });
      } catch {
        // ignore os lookup
      }
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
