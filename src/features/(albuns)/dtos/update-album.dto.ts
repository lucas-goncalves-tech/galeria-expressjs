import { z } from 'zod';

// Na atualização, todos os campos são opcionais
export const updateAlbumSchema = z
  .object({
    title: z
      .string()
      .min(3, 'Titulo do álbum deve ter no mínimo 3 caracteres.')
      .max(30, 'Titulo do álbum deve ter no máximo 30 caracteres.')
      .optional(),
    description: z
      .string()
      .max(200, 'Descrição deve ter no máximo 200 caracteres.')
      .optional(),
    visibility: z.enum(['PUBLIC', 'PRIVATE']).optional(),
  })
  .refine((data) => {
    return Object.keys(data).length > 0;
  }, 'Pelo menos um campo deve ser fornecido para atualização.')
  .strict();

export type UpdateAlbumDTO = z.infer<typeof updateAlbumSchema>;
