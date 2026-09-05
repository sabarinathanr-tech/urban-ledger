import type { Response } from 'express';
import type { ErrorCode } from '../config/constants.js';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: ErrorCode | string;
    details?: unknown;
  };
}

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200
): Response => {
  const payload: ApiResponse<T> = {
    success: true,
    message,
    ...(data !== undefined && { data }),
  };

  return res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  message: string,
  code: ErrorCode | string,
  statusCode = 400,
  details: unknown = null
): Response => {
  const payload: ApiResponse = {
    success: false,
    message,
    error: {
      code,
      ...(details !== null && details !== undefined && { details }),
    },
  };

  return res.status(statusCode).json(payload);
};
