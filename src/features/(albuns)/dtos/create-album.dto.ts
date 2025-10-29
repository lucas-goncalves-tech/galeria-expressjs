import { z } from 'zod';

export const createAlbumSchema = z
  .object({
    name: z.string().min(3, 'Nome do álbum deve ter no mínimo 3 caracteres.'),
    description: z.string().optional(),
    visibility: z.enum(['PUBLIC', 'PRIVATE']).default('PRIVATE').optional(),
  })
  .strict();

// Tipo inferido para uso no serviço
export type CreateAlbumDTO = z.infer<typeof createAlbumSchema>;
