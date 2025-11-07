import { BaseError } from './base.error';

export class ForbiddenError extends BaseError {
  constructor(message: string = 'Você não tem acesso a esse recurso!') {
    super(message, 403);
  }
}
