import { NextFunction, Request, Response } from 'express';
import { BaseError } from 'shared/erros/base.error';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        statusCode: err.statusCode,
      },
    });
  }

  console.error(err);

  return res.status(500).json({
    error: {
      message: 'Internal Server Error',
      statusCode: 500,
    },
  });
}
