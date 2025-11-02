import { Request, Response } from 'express';
import { ImageService } from './image.service';

export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  upload = async (req: Request, res: Response) => {
    const file = req.file!;
    const { id: albumId } = req.params;
    const { sub: userId } = req.user!;

    const newImage = await this.imageService.uploadImageToAlbum(
      file,
      albumId,
      userId,
    );

    res.status(201).json(newImage);
  };
}
