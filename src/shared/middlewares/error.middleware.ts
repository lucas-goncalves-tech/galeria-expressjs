import { NextFunction, Request, Response } from 'express';
import { BaseError } from 'shared/erros/base.error';
import { ValidationError } from 'shared/erros/validation.error';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err);
  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      message: err.message,
      statusCode: err.statusCode,
      details: err.details,
    });
  }

  return res.status(500).json({
    message: 'Erro interno no servidor',
    statusCode: 500,
  });
}
