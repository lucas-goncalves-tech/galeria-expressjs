import z from 'zod';

export const tokensSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});

export type TokensDTO = z.infer<typeof tokensSchema>;
