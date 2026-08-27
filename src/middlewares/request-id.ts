import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

/**
 * Assigns a unique ID to each request via the X-Request-Id header.
 * Reuses the client-provided ID if present.
 */
export function requestId(req: Request, res: Response, next: NextFunction): void {
  const id = (req.headers['x-request-id'] as string) || uuidv4();

  res.setHeader('X-Request-Id', id);
  res.locals.requestId = id;

  logger.info(`[${id.substring(0, 8)}] ${req.method} ${req.originalUrl}`);
  next();
}
