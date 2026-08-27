import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

/**
 * Middleware that assigns a unique request ID to every incoming request.
 *
 * - Generates a UUID v4 and attaches it to `res.locals.requestId`
 * - Sets the `X-Request-Id` response header
 * - Logs the request with method, URL, and request ID
 */
export function requestId(req: Request, res: Response, next: NextFunction): void {
  const id = (req.headers['x-request-id'] as string) || uuidv4();

  res.setHeader('X-Request-Id', id);
  res.locals.requestId = id;

  logger.info(`[${id.substring(0, 8)}] ${req.method} ${req.originalUrl}`);

  next();
}
