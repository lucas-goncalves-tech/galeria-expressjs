import { Router } from 'express';
import albumRouter from 'features/(albuns)/album.routes';
import { authRouter } from 'features/(auth)/auth.routes';
import imageRouter from 'features/(images)/image.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

router.use('/auth', authRouter);
router.use('/album', albumRouter);
router.use('/album', imageRouter);

router.use((req, res) => {
  res.status(404).json({
    error: 'Não encontrado!',
    message: `Rota ${req.originalUrl} Não existe!!`,
  });
});
export default router;
