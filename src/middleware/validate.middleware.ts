import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { sendError } from '../helpers/api-response';

export const validate = (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    if (!result.success) {
      const errors = result.error.issues.map(e => ({
        field: e.path.slice(1).join('.'),
        message: e.message,
      }));
      sendError(res, 400, 'Datos de entrada inválidos', JSON.stringify(errors));
      return;
    }
    next();
  };
