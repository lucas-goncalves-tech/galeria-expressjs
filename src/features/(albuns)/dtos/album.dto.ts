import z from 'zod';

export const albumSchema = z.object({
  id: z.uuid(),
  cover_image_key: z.string().nullable().optional(),
  title: z
    .string()
    .min(3, 'Titulo do álbum deve ter no mínimo 3 caracteres.')
    .max(30, 'Titulo deve ter no máximo 30 caracteres'),
  description: z
    .string()
    .max(200, 'Descrição deve ter no máximo 200 caracteres.')
    .nullable(),
  user_id: z.uuid(),
  visibility: z.enum(['PUBLIC', 'PRIVATE']),
  created_at: z.string(),
});

export const albumsSchema = z.array(albumSchema);

export type AlbumDTO = z.infer<typeof albumSchema>;
