import { Router } from 'express';
import { ImageController } from './image.controller';
import { authMiddleware } from 'shared/middlewares/auth.middleware';
import { uploadMiddleware } from 'shared/middlewares/multer.middleware';
import { validateFileMiddleware } from 'shared/middlewares/validate-file.middleware';
import { ImageService } from './image.service';
import { ImageRepository } from './image.repository';
import { db } from 'database/connection';
import { AlbumRepository } from 'features/(albuns)/album.repository';
import { LocalStorageProvider } from 'shared/providers/StorageProvider/implementations/LocalStorageProvider';

const imageRepository = new ImageRepository(db);
const albumRepository = new AlbumRepository(db);
const storageProvider = new LocalStorageProvider();
const imageService = new ImageService(
  albumRepository,
  imageRepository,
  storageProvider,
);
const imageController = new ImageController(imageService);
const imageRouter = Router();

imageRouter.post(
  '/:id/images',
  authMiddleware,
  uploadMiddleware,
  validateFileMiddleware,
  imageController.upload,
);

export default imageRouter;
