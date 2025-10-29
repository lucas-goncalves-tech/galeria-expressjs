import { Router } from 'express';
import albumRouter from 'features/(albuns)/album.routes';
import { authRouter } from 'features/(auth)/auth.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

router.use('/auth', authRouter);
router.use('/album', albumRouter);

export default router;
