import type { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale records periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

/**
 * Lightweight in-memory rate limiter for auth / sensitive endpoints
 * @param maxRequests Maximum requests allowed in time window
 * @param windowMs Time window in milliseconds (default 1 minute)
 */
export function createRateLimiter(maxRequests = 40, windowMs = 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Skip rate limiting in automated test environment if requested
    if (process.env.NODE_ENV === 'test') {
      return next();
    }

    const clientIp = req.ip || req.socket.remoteAddress || 'unknown-ip';
    const key = `${clientIp}:${req.baseUrl}${req.path}`;
    const now = Date.now();

    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    record.count += 1;

    if (record.count > maxRequests) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      sendError(
        res,
        'Too many attempts. Please wait a moment before trying again.',
        'RATE_LIMIT_EXCEEDED',
        429,
        { retryAfterSeconds }
      );
      return;
    }

    return next();
  };
}
