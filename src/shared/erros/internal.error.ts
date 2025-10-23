import { BaseError } from './base.error';

export class InternalError extends BaseError {
  constructor() {
    super('Erro interno no servidor', 500);
  }
}
