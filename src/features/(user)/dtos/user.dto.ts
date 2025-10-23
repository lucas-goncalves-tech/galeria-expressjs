import { z } from 'zod';

export const userWithHashSchema = z
  .object({
    id: z.string(),
    username: z
      .string()
      .min(3, 'Username precisa ter no minimo 3 caracteres')
      .max(30, 'Username pode ter no maximo 30 caracteres'),
    email: z.email(),
    password_hash: z.string(),
    created_at: z.string().optional(),
  })
  .strict();

export const userSchema = userWithHashSchema
  .omit({ password_hash: true })
  .strict();

export type UserDTO = z.infer<typeof userSchema>;
export type UserWithHashDto = z.infer<typeof userWithHashSchema>;
