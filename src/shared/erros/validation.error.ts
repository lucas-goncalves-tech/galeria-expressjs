import { BaseError } from './base.error';

export class ValidationError extends BaseError {
  constructor(message = 'Erro de validação', details?: unknown[]) {
    super(message, 400, details);
  }
}
