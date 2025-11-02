import { Router } from 'express';
import { AlbumController } from './album.controller';
import { AlbumRepository } from './album.repository';
import { AlbumService } from './album.service';
import { authMiddleware } from 'shared/middlewares/auth.middleware';
import { validateMiddleware } from 'shared/middlewares/validate.middleware';
import { createAlbumSchema } from './dtos/create-album.dto';
import { updateAlbumSchema } from './dtos/update-album.dto';
import { db } from 'database/connection';

const albumService = new AlbumService(new AlbumRepository(db));
const albumController = new AlbumController(albumService);
const albumRouter = Router();

albumRouter.post(
  '/',
  authMiddleware,
  validateMiddleware({ body: createAlbumSchema }),
  albumController.create,
);

albumRouter.get('/', authMiddleware, albumController.findAllByUserId);
albumRouter.get('/:id', authMiddleware, albumController.findById);
albumRouter.put(
  '/:id',
  authMiddleware,
  validateMiddleware({ body: updateAlbumSchema }),
  albumController.update,
);
albumRouter.delete('/:id', authMiddleware, albumController.delete);

export default albumRouter;
