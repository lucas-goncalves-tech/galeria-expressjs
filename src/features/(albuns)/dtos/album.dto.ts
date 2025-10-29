import z from 'zod';

export const albumSchema = z.object({
  id: z.uuid(),
  title: z.string().min(3, 'Nome do álbum deve ter no mínimo 3 caracteres.'),
  description: z.string().nullable(),
  user_id: z.uuid(),
  visibility: z.enum(['PUBLIC', 'PRIVATE']),
  created_at: z.string(),
});

export const albumsSchema = z.array(albumSchema.omit({ user_id: true }));

export type AlbumDTO = z.infer<typeof albumSchema>;
