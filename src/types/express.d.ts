import { JwtPayloadDTO } from 'features/(auth)/dtos/jwt_payload.dto';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadDTO; // ou `user: UserDTO` se você garantir que sempre existe
    }
  }
}
