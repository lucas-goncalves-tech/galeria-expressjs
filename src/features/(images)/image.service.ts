import { AlbumRepository } from 'features/(albuns)/album.repository';
import path from 'node:path';
import { ForbiddenError } from 'shared/erros/forbidden.error';
import { NotFoundError } from 'shared/erros/not-found.error';
import { IStorageProvider } from 'shared/providers/StorageProvider/IStorageProvider';
import { IImageCreate } from './interfaces/IImageCreate';
import { ImageRepository } from './image.repository';

export class ImageService {
  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly imageRepository: ImageRepository,
    private readonly storageProvider: IStorageProvider,
  ) {}

  async uploadImageToAlbum(
    file: Express.Multer.File,
    albumId: string,
    userId: string,
  ) {
    const existAlbum = await this.albumRepository.findById(albumId);
    if (!existAlbum) {
      throw new NotFoundError('Album não encontrado!');
    }
    if (existAlbum.user_id !== userId) {
      throw new ForbiddenError('Vocẽ não tem acesso a esse album!');
    }

    const fileExt = path.extname(file.originalname);
    const safeFileName = `${crypto.randomUUID()}${fileExt}`;
    const isFirstAlbumimage = !existAlbum.cover_image_key;

    await this.storageProvider.save(file.buffer, safeFileName);

    const imageData: IImageCreate = {
      album_id: albumId,
      storage_key: safeFileName,
      original_name: file.originalname,
      mime_type: file.mimetype,
      size: file.size,
    };
    const newImage = await this.imageRepository.create(imageData);

    if (isFirstAlbumimage) {
      await this.albumRepository.updateCover(albumId, newImage.storage_key);
    }

    return newImage;
  }
}
