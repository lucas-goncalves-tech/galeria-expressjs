import { z } from 'zod';

// Na atualização, todos os campos são opcionais
export const updateAlbumSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Nome do álbum deve ter no mínimo 3 caracteres.')
      .optional(),
    description: z.string().optional().nullable(),
    visibility: z.enum(['PUBLIC', 'PRIVATE']).optional(),
  })
  .refine((data) => {
    return Object.keys(data).length > 0;
  }, 'Pelo menos um campo deve ser fornecido para atualização.')
  .strict();

export type UpdateAlbumDTO = z.infer<typeof updateAlbumSchema>;
