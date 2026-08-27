import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../errors/app-error';
import { logger } from '../utils/logger';

/**
 * Global error-handling middleware.
 * Must be registered AFTER all routes in Express.
 *
 * - Known operational errors (AppError) → appropriate status code + message
 * - Unknown errors → 500 Internal Server Error
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  // Handle known operational errors
  if (err instanceof AppError) {
    const response: Record<string, unknown> = {
      status: 'error',
      message: err.message,
    };

    // Attach field-level details for validation errors
    if (err instanceof ValidationError && err.details.length > 0) {
      response.details = err.details;
    }

    logger.warn(`[${err.statusCode}] ${err.message}`);
    res.status(err.statusCode).json(response);
    return;
  }

  // Unknown / unexpected errors
  logger.error('Unexpected error:', err);

  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}
