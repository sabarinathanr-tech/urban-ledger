import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { sendError } from '../utils/response.js';
import { ERROR_CODES } from '../config/constants.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  // Operational AppError instances
  if (err instanceof AppError) {
    logger.warn(`Operational error: ${err.message}`, {
      code: err.code,
      statusCode: err.statusCode,
      path: req.path,
      method: req.method,
    });

    sendError(res, err.message, err.code, err.statusCode, err.details);
    return;
  }

  // Handle Prisma errors if they contain code
  const maybePrismaError = err as { code?: string; meta?: { target?: string[] } };
  if (maybePrismaError && typeof maybePrismaError.code === 'string') {
    if (maybePrismaError.code === 'P2002') {
      const target = maybePrismaError.meta?.target?.join(', ') || 'field';
      logger.warn(`Prisma unique constraint violation: ${target}`);
      sendError(
        res,
        `A record with this ${target} already exists.`,
        ERROR_CODES.CONFLICT,
        409,
        { target }
      );
      return;
    }

    if (maybePrismaError.code === 'P2025') {
      logger.warn('Prisma record not found');
      sendError(res, 'Record not found.', ERROR_CODES.NOT_FOUND, 404);
      return;
    }
  }

  // Unexpected or unhandled internal errors
  const errorMessage = err instanceof Error ? err.message : 'Unknown internal error';
  logger.error(`Unhandled error: ${errorMessage}`, {
    stack: err instanceof Error ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  sendError(
    res,
    'An internal server error occurred. Please try again later.',
    ERROR_CODES.INTERNAL_ERROR,
    500
  );
};
