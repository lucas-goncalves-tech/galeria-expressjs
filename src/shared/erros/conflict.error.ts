import { BaseError } from './base.error';

export class ConflictError extends BaseError {
  constructor(message = 'Conflito de dados') {
    super(message, 409);
  }
}
