import { z } from 'zod';

export const userWithHashSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(3, 'Username precisa ter no minimo 3 caracteres')
    .max(30, 'Username pode ter no maximo 30 caracteres'),
  email: z.email(),
  password_hash: z.string(),
  role: z.enum(['user', 'admin']).default('user'),
  created_at: z.string().optional(),
});

export const userSchema = userWithHashSchema.omit({ password_hash: true });

export type UserDTO = z.infer<typeof userSchema>;
export type UserWithHashDto = z.infer<typeof userWithHashSchema>;
