// src/shared/middlewares/logger.middleware.ts
import { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';

const sanitize = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;
  const copy = { ...obj };
  const secrets = ['password', 'senha', 'token', 'authorization'];
  secrets.forEach((k) => {
    if (k in copy) copy[k] = '[REDACTED]';
  });
  return copy;
};

export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const start = Date.now();

  // captura body/params/query antes de qualquer coisa
  const { method, originalUrl: url } = req;
  const body = sanitize(req.body);
  const params = sanitize(req.params);
  const query = sanitize(req.query);

  // quando a resposta terminar
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;

    const methodColor =
      method === 'GET'
        ? chalk.green
        : method === 'POST'
          ? chalk.blue
          : method === 'PUT'
            ? chalk.yellow
            : method === 'DEL'
              ? chalk.red
              : chalk.gray;

    const statusColor =
      status < 300
        ? chalk.green
        : status < 400
          ? chalk.yellow
          : status < 500
            ? chalk.magenta
            : chalk.red;

    const line = [
      methodColor(method.padEnd(6)),
      statusColor(status.toString().padEnd(3)),
      chalk.gray(`${duration}ms`),
      chalk.white(url),
    ].join(' | ');

    console.log(line);
    const hasData = (o: any) => o && Object.keys(o).length > 0;

    if (hasData(body)) console.log(chalk.cyan('  Body  :'), body);
    if (hasData(params)) console.log(chalk.cyan('  Params:'), params);
    if (hasData(query)) console.log(chalk.cyan('  Query :'), query);
  });

  next();
}
