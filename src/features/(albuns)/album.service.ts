import { NotFoundError } from 'shared/erros/not-found.error';
import { AlbumRepository } from './album.repository';
import { CreateAlbumDTO } from './dtos/create-album.dto';
import { ForbiddenError } from 'shared/erros/forbidden.error';
import { UpdateAlbumDTO } from './dtos/update-album.dto';
import { ImageRepository } from 'features/(images)/image.repository';

export class AlbumService {
  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly imageRepository: ImageRepository,
  ) {}

  async create(newAlbumData: CreateAlbumDTO, userId: string) {
    const { user_id, ...safeNewAlbum } = await this.albumRepository.create(
      newAlbumData,
      userId,
    );
    return safeNewAlbum;
  }

  async getAlbumImages(albumId: string, userId: string) {
    const existAlbum = await this.albumRepository.findById(albumId);
    if (!existAlbum) {
      throw new NotFoundError('Album não encontrado!');
    }
    if (existAlbum.visibility === 'PRIVATE' && existAlbum.user_id !== userId) {
      throw new ForbiddenError('Vocẽ não tem acesso a esse album!');
    }
    const baseUrl = process.env.API_BASE_URL!;
    const images = await this.imageRepository.findByalbumId(existAlbum.id);
    return images.map((img) => {
      const thumbnailUrl = img.thumbnail_key
        ? `${baseUrl}/image/${img.thumbnail_key}`
        : null;
      const imageUrl = `${baseUrl}/image/${img.storage_key}`;

      return {
        id: img.id,
        storage_key: img.storage_key,
        original_name: img.original_name,
        urls: {
          thumbnail: thumbnailUrl,
          original: imageUrl,
        },
      };
    });
  }

  async findAllByUserId(userId: string) {
    const albums = await this.albumRepository.findAllByUserId(userId);
    const baseUrl = process.env.API_BASE_URL;
    return albums.map(({ user_id, cover_image_key, ...safe }) => ({
      ...safe,
      cover_image_url: cover_image_key
        ? `${baseUrl}/image/${cover_image_key}`
        : null,
    }));
  }

  async findById(albumId: string, userId: string) {
    const album = await this.albumRepository.findById(albumId);
    if (!album) {
      throw new NotFoundError('Album não encontrado!');
    }
    if (album.visibility !== 'PUBLIC' && album.user_id !== userId) {
      throw new ForbiddenError('Vocẽ não tem acesso a esse album!');
    }
    const { user_id, ...albumWithoutUserId } = album;
    return albumWithoutUserId;
  }

  async update(
    albumDataUpdate: UpdateAlbumDTO,
    albumId: string,
    userId: string,
  ) {
    const albumExist = await this.albumRepository.findById(albumId);
    if (!albumExist) {
      throw new NotFoundError('Album não encontrado!');
    }
    if (albumExist.user_id !== userId) {
      throw new ForbiddenError('Voce não tem acceso a esse album!');
    }

    const { user_id, ...safeAlbum } = await this.albumRepository.update(
      albumDataUpdate,
      albumId,
      userId,
    );
    return safeAlbum;
  }

  async delete(albumId: string, userId: string) {
    const albumExist = await this.albumRepository.findById(albumId);
    if (!albumExist) {
      throw new NotFoundError('Album não encontrado!');
    }

    if (albumExist.user_id !== userId) {
      throw new ForbiddenError('Você não tem acesso a esse album!');
    }

    const isAlbumDeleted = await this.albumRepository.delete(albumId, userId);
    if (!isAlbumDeleted) {
      throw new Error('Erro ao deletar album!');
    }
  }
}
