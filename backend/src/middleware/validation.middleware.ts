import type { Request, Response, NextFunction } from 'express';
import { type ZodType, ZodError } from 'zod';
import { sendError } from '../utils/response.js';
import { ERROR_CODES } from '../config/constants.js';

export const validateBody = (schema: ZodType) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = (error.issues || []).map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        sendError(res, 'Validation failed for request body', ERROR_CODES.VALIDATION_ERROR, 400, details);
        return;
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: ZodType) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = (await schema.parseAsync(req.query)) as Record<string, unknown>;
      // In Express 5, req.query is a getter, so we mutate its properties with Object.assign
      Object.assign(req.query, parsed);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = (error.issues || []).map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        sendError(res, 'Validation failed for query parameters', ERROR_CODES.VALIDATION_ERROR, 400, details);
        return;
      }
      next(error);
    }
  };
};
