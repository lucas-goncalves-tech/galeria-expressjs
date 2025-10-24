import { Router } from 'express';
import { authRouter } from 'features/(auth)/auth.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

router.use('/auth', authRouter);

export default router;
