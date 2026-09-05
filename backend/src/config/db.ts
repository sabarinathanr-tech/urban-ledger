import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

declare global {
  // eslint-disable-next-line no-var
  var __urbanLedgerPrisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.__urbanLedgerPrisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? [
            { emit: 'event', level: 'query' },
            { emit: 'stdout', level: 'warn' },
            { emit: 'stdout', level: 'error' },
          ]
        : ['warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__urbanLedgerPrisma = prisma;
}

let isDbAvailable = false;

export const connectDatabase = async (): Promise<boolean> => {
  try {
    // Quick test query to verify connection
    await prisma.$queryRaw`SELECT 1`;
    isDbAvailable = true;
    logger.info('Database connected successfully via Prisma');
    return true;
  } catch (error) {
    isDbAvailable = false;
    logger.warn('Database connection failed or not yet migrated. Operating with fallback storage where needed.', {
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
};

export const isDatabaseAvailable = (): boolean => isDbAvailable;
