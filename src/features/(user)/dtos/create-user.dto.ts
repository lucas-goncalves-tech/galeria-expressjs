import z from 'zod';
import { userWithHashSchema } from './user.dto';

export const createUserDTO = userWithHashSchema.omit({
  id: true,
  created_at: true,
});

export type CreateUserDTO = z.infer<typeof createUserDTO>;
