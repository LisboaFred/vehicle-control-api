import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Middleware factory that validates `req.body` against a Zod schema.
 *
 * On success, the parsed (and possibly transformed) data replaces `req.body`.
 * On failure, returns 400 with structured field-level error details.
 *
 * @example
 * router.post('/', validate(createAutomobileSchema), controller.create);
 */
export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        _res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          details,
        });
        return;
      }
      next(error);
    }
  };
}
