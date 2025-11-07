import { NotFoundError } from 'shared/erros/not-found.error';
import { AlbumRepository } from './album.repository';
import { CreateAlbumDTO } from './dtos/create-album.dto';
import { ForbiddenError } from 'shared/erros/forbidden.error';
import { UpdateAlbumDTO } from './dtos/update-album.dto';

export class AlbumService {
  constructor(private readonly albumRepository: AlbumRepository) {}

  async create(newAlbumData: CreateAlbumDTO, userId: string) {
    const { user_id, ...safeNewAlbum } = await this.albumRepository.create(
      newAlbumData,
      userId,
    );
    return safeNewAlbum;
  }

  async findAllByUserId(userId: string) {
    const albums = await this.albumRepository.findAllByUserId(userId);
    return albums.map(({ user_id, ...safe }) => safe);
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
