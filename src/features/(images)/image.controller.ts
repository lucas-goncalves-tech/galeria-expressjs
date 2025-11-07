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

  download = async (req: Request, res: Response) => {
    const { id: storage_key } = req.params;
    const { sub: userId } = req.user!;

    const fileDetails = await this.imageService.getDownloadDetails(
      storage_key,
      userId,
    );

    res.setHeader('Content-Type', fileDetails.mime_type);
    res.setHeader(
      'Content-Disposition',
      `inline; filename=${fileDetails.original_name}`,
    );
    res.sendFile(fileDetails.filePath);
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { sub } = req.user!;

    await this.imageService.delete(id, sub);

    res.status(204).end();
  };
}
