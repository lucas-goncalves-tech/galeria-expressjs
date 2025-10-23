import { BaseError } from './base.error';

export class NotFoundError extends BaseError {
  constructor(message = 'Recurso não encontrado') {
    super(message, 404);
  }
}
