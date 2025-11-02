import z from 'zod';

export const imageSchema = z.object({
  id: z.uuid(),
  album_id: z.string(),
  storage_key: z.string(),
  original_name: z.string(),
  mime_type: z.enum(['image/png', 'image/jpeg']),
  size: z.number(),
  created_at: z.string(),
});

export type ImageDTO = z.infer<typeof imageSchema>;
