import z from 'zod';

export const jwtPayloadSchema = z.object({
  sub: z.uuid(),
  iat: z.number(),
  exp: z.number(),
});

export type JwtPayloadDTO = z.infer<typeof jwtPayloadSchema>;
