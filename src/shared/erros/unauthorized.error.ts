import { BaseError } from './base.error';

export class UnauthorizedError extends BaseError {
  constructor(message = 'Não autorizado') {
    super(message, 401);
  }
}
