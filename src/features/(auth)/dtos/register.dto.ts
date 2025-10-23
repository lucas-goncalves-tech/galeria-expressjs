import z from 'zod';

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'O nome de usuário deve ter pelo menos 3 caracteres')
      .max(30, 'O nome de usuário deve ter no máximo 30 caracteres'),
    email: z.email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z
      .string()
      .min(6, 'A confirmação de senha deve ter pelo menos 6 caracteres'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })
  .strict();

export type RegisterDTO = z.infer<typeof registerSchema>;
