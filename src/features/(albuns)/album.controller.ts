import { Request, Response } from 'express';
import { AlbumService } from './album.service';
import { CreateAlbumDTO } from './dtos/create-album.dto';
import { UpdateAlbumDTO } from './dtos/update-album.dto';

export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  create = async (req: Request, res: Response) => {
    const user = req.user!;
    const newAlbumData = req.body as CreateAlbumDTO;

    const newAlbum = await this.albumService.create(newAlbumData, user.sub);

    res.status(201).json(newAlbum);
  };

  findAllByUserId = async (req: Request, res: Response) => {
    const { sub } = req.user!;

    const albums = await this.albumService.findAllByUserId(sub);

    res.status(200).json(albums);
  };

  findById = async (req: Request, res: Response) => {
    const { sub } = req.user!;
    const albumId = req.params.id;

    const album = await this.albumService.findById(albumId, sub);

    res.status(200).json(album);
  };

  update = async (req: Request, res: Response) => {
    const { sub } = req.user!;
    const albumId = req.params.id;
    const albumDataToUpdate = req.body as UpdateAlbumDTO;

    const updatedAlbum = await this.albumService.update(
      albumDataToUpdate,
      albumId,
      sub,
    );

    res.status(200).json(updatedAlbum);
  };

  delete = async (req: Request, res: Response) => {
    const { sub } = req.user!;
    const { id } = req.params;

    await this.albumService.delete(id, sub);

    res.status(204).end();
  };
}
