import { AlbumRepository } from 'features/(albuns)/album.repository';
import path from 'node:path';
import { ForbiddenError } from 'shared/erros/forbidden.error';
import { NotFoundError } from 'shared/erros/not-found.error';
import { IStorageProvider } from 'shared/providers/StorageProvider/IStorageProvider';
import { IImageCreate } from './interfaces/IImageCreate';
import { ImageRepository } from './image.repository';
import { Database } from 'better-sqlite3';
import sharp from 'sharp';

export class ImageService {
  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly imageRepository: ImageRepository,
    private readonly storageProvider: IStorageProvider,
    private readonly db: Database,
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
    const fileUUID = crypto.randomUUID();
    const safeFileName = `${fileUUID}${fileExt}`;
    const thumbnailKey = `thumb-${fileUUID}.jpeg`;
    const thumbnailbuffer = await sharp(file.buffer)
      .resize(200, 200)
      .jpeg({
        quality: 80,
      })
      .toBuffer();
    const isFirstAlbumimage = !existAlbum.cover_image_key;

    await this.storageProvider.save(file.buffer, safeFileName);
    await this.storageProvider.save(thumbnailbuffer, thumbnailKey);

    const imageData: IImageCreate = {
      album_id: albumId,
      storage_key: safeFileName,
      thumbnail_key: thumbnailKey || null,
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

  async getDownloadDetails(storage_key: string, userId: string) {
    const existImage = await this.imageRepository.findByStorageKey(storage_key);
    if (!existImage) {
      throw new NotFoundError('Imagem não encontrada!');
    }
    const existAlbum = await this.albumRepository.findById(existImage.album_id);
    if (!existAlbum) {
      throw new NotFoundError('Album não encontrado!');
    }

    if (existAlbum.visibility === 'PRIVATE' && existAlbum.user_id !== userId) {
      throw new ForbiddenError('Você não tem acesso a esse album!');
    }

    const filePath = this.storageProvider.getAbsolutePath(
      existImage.storage_key,
    );

    return {
      filePath,
      mime_type: existImage.mime_type,
      original_name: existImage.original_name,
    };
  }

  async delete(storage_key: string, userId: string) {
    const existImage = await this.imageRepository.findByStorageKey(storage_key);
    if (!existImage) {
      throw new NotFoundError('Imagem não encontrada!');
    }
    const existAlbum = await this.albumRepository.findById(existImage.album_id);
    if (!existAlbum) {
      throw new NotFoundError('Album não encontrado!');
    }
    if (existAlbum.user_id !== userId) {
      throw new ForbiddenError('Você não tem acesso a esse album!');
    }
    try {
      this.db.prepare('BEGIN TRANSACTION').run();
      await this.imageRepository.delete(existImage.id);

      if (existAlbum.cover_image_key === storage_key) {
        const allImages = await this.imageRepository.findByalbumId(
          existAlbum.id,
        );
        const otherImages = allImages.filter((img) => existImage.id !== img.id);

        if (otherImages.length > 0) {
          const newCoverKey =
            otherImages[0].thumbnail_key || otherImages[0].storage_key;
          await this.albumRepository.updateCover(existAlbum.id, newCoverKey);
        } else {
          await this.albumRepository.updateCover(existAlbum.id, null);
        }
      }

      this.db.prepare('COMMIT').run();
    } catch (error) {
      this.db.prepare('ROLLBACK').run();
      console.error('Transaction falhou ao deletar imagem:', error);
      throw error;
    }

    try {
      await this.storageProvider.delete(storage_key);
      if (existImage.thumbnail_key) {
        await this.storageProvider.delete(existImage.thumbnail_key);
      }
    } catch (error) {
      console.error('Falaha ao deletar imagem do sistema: ', error);
      throw error;
    }
  }
}
