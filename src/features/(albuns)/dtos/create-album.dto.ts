import { z } from 'zod';

export const createAlbumSchema = z
  .object({
    title: z
      .string()
      .min(3, 'Titulo do álbum deve ter no mínimo 3 caracteres.')
      .max(30, 'Titulo do álbum deve ter no máximo 30 caracteres.'),
    description: z
      .string()
      .max(200, 'Descrição deve ter no máximo 200 caracteres.')
      .optional(),
    visibility: z.enum(['PUBLIC', 'PRIVATE']).default('PRIVATE'),
  })
  .strict();

// Tipo inferido para uso no serviço
export type CreateAlbumDTO = z.infer<typeof createAlbumSchema>;
