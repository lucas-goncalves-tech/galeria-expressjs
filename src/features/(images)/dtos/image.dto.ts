import z from 'zod';

export const imageSchema = z.object({
  id: z.uuid(),
  album_id: z.string(),
  storage_key: z.string(),
  thumbnail_key: z.string().nullable(),
  original_name: z.string(),
  mime_type: z.enum(['image/png', 'image/jpeg']),
  size: z.number(),
  created_at: z.string(),
});
export const imagesSchema = z.array(imageSchema);

export type ImageDTO = z.infer<typeof imageSchema>;
