import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from 'shared/middlewares/validate.middleware';
import { loginSchema } from './dtos/login.dto';
import { registerSchema } from './dtos/register.dto';
import { authMiddleware } from 'shared/middlewares/auth.middleware';
import { AuthService } from './auth.service';
import { UserRepository } from 'features/(user)/user.repository';

const authService = new AuthService(new UserRepository());
const authController = new AuthController(authService);
const authRouter = Router();

authRouter.post(
  '/register',
  validate({ body: registerSchema }),
  authController.register,
);
authRouter.post(
  '/login',
  validate({ body: loginSchema }),
  authController.login,
);
authRouter.get('/me', authMiddleware, authController.me);

export { authRouter };
