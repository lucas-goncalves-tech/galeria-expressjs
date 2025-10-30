import { NotFoundError } from 'shared/erros/not-found.error';
import { AlbumRepository } from './album.repository';
import { CreateAlbumDTO } from './dtos/create-album.dto';
import { ForbiddenError } from 'shared/erros/forbidden.error';

export class AlbumService {
  constructor(private readonly albumRepository: AlbumRepository) {}

  async create(newAlbumData: CreateAlbumDTO, userId: string) {
    return await this.albumRepository.create(newAlbumData, userId);
  }

  async findAllByUserId(userId: string) {
    return await this.albumRepository.findAllByUserId(userId);
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
}
