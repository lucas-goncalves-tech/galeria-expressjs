import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from 'shared/middlewares/validate.middleware';
import { loginSchema } from './dtos/login.dto';
import { registerSchema } from './dtos/register.dto';
import { authMiddleware } from 'shared/middlewares/auth.middleware';

const authController = new AuthController();
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
