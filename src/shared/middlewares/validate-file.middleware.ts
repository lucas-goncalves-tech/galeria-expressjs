import { NextFunction, Request, Response } from 'express';
import { fileTypeFromBuffer } from 'file-type';
import { ValidationError } from 'shared/erros/validation.error';

export async function validateFileMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (req.file && req.file.buffer) {
      const fileType = await fileTypeFromBuffer(req.file.buffer);
      const allowedType = ['image/jpeg', 'image/png'];

      if (fileType && allowedType.includes(fileType.mime)) {
        req.file.mimetype = fileType.mime;
        return next();
      }

      throw new ValidationError('Tipo de arquivo invalido!');
    }

    throw new ValidationError('Arquivo não enviado ou corromido!');
  } catch (error) {
    console.error('Validação de tipo de arquivo falhou: ', error);
    throw error;
  }
}
