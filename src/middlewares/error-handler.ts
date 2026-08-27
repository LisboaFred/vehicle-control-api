import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../errors/app-error';
import { logger } from '../utils/logger';

/**
 * Global error-handling middleware.
 * Must be registered after all routes.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    const response: Record<string, unknown> = {
      status: 'error',
      message: err.message,
    };

    if (err instanceof ValidationError && err.details.length > 0) {
      response.details = err.details;
    }

    logger.warn(`[${err.statusCode}] ${err.message}`);
    res.status(err.statusCode).json(response);
    return;
  }

  logger.error('Unexpected error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}
