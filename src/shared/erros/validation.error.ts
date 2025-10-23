import { BaseError } from './base.error';

export class ValidationError extends BaseError {
  constructor(message = 'Erro de validação') {
    super(message, 400);
  }
}
