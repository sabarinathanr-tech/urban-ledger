import type { Request, Response } from 'express';
import { sendError } from '../utils/response.js';
import { ERROR_CODES } from '../config/constants.js';

export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(
    res,
    `Route ${req.method} ${req.originalUrl} not found`,
    ERROR_CODES.NOT_FOUND,
    404
  );
};
