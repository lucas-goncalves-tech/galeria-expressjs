import { NextFunction, Request, Response } from 'express';
import { jwtPayloadSchema } from 'features/(auth)/dtos/jwt_payload.dto';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { UnauthorizedError } from 'shared/erros/unauthorized.error';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET não está definido');
  }
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Token não fornecido ou inválido');
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const safePayload = jwtPayloadSchema.parse(payload);
    req.user = safePayload;
    next();
  } catch (error) {
    if (
      error instanceof JsonWebTokenError ||
      error instanceof TokenExpiredError ||
      error instanceof SyntaxError
    ) {
      throw new UnauthorizedError('Token inválido ou expirado');
    }
    throw error;
  }
}
