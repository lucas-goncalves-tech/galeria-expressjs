import z from 'zod';

export const loginSchema = z
  .object({
    email: z.email('Email inválido'),
    password: z
      .string()
      .min(6, 'A senha deve ter pelo menos 6 caracteres!')
      .max(20, 'A Senha deve ter no máximo 20 caracteres!'),
  })
  .strict();

export type LoginDTO = z.infer<typeof loginSchema>;
