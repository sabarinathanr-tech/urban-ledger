import type { Request, Response, NextFunction } from 'express';
import { ERROR_CODES, type Role } from '../config/constants.js';
import { sendError } from '../utils/response.js';

export const requireRole = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Authentication required before checking role permissions', ERROR_CODES.AUTHENTICATION_REQUIRED, 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(
        res,
        'You do not have permission to access this resource',
        ERROR_CODES.INSUFFICIENT_PERMISSIONS,
        403
      );
      return;
    }

    next();
  };
};
