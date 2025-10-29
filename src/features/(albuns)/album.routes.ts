import { Router } from 'express';
import { AlbumController } from './album.controller';
import { AlbumRepository } from './album.repository';
import { AlbumService } from './album.service';
import { authMiddleware } from 'shared/middlewares/auth.middleware';
import { validate } from 'shared/middlewares/validate.middleware';
import { createAlbumSchema } from './dtos/create-album.dto';

const albumService = new AlbumService(new AlbumRepository());
const albumController = new AlbumController(albumService);
const albumRouter = Router();

albumRouter.post(
  '/',
  authMiddleware,
  validate({ body: createAlbumSchema }),
  albumController.create,
);

albumRouter.get('/', authMiddleware, albumController.findAllByUserId);
albumRouter.get('/:id', authMiddleware, albumController.findById);

export default albumRouter;
