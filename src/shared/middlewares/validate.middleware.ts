import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'shared/erros/validation.error';
import z, { ZodError } from 'zod';

interface ISchemas {
  body?: z.ZodType;
  query?: z.ZodType;
  params?: z.ZodType;
}

export function validateMiddleware(schema: ISchemas) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const errors: { path: string; message: string }[] = [];
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      if (schema.query) {
        req.query = (await schema.query.parseAsync(
          req.query,
        )) as Request['query'];
      }
      if (schema.params) {
        req.params = (await schema.params.parseAsync(
          req.params,
        )) as Request['params'];
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        error.issues.forEach((issue) => {
          errors.push({ path: issue.path.join('.'), message: issue.message });
        });
        throw new ValidationError('Falha na validação', errors);
      }
      throw error;
    }
  };
}
