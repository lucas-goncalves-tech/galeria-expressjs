import { Database } from 'better-sqlite3';
import { IImageCreate } from './interfaces/IImageCreate';
import { imageSchema, imagesSchema } from './dtos/image.dto';

export class ImageRepository {
  constructor(private readonly db: Database) {}

  async create(imageData: IImageCreate) {
    const sql = `INSERT INTO "images" 
    (id, album_id, storage_key, thumbnail_key, original_name, mime_type, size)
    VALUES (@id, @album_id, @storage_key, @thumbnail_key, @original_name, @mime_type, @size)
    RETURNING *`;
    const newImage = {
      ...imageData,
      id: crypto.randomUUID(),
    };
    try {
      const row = this.db.prepare(sql).get(newImage);
      return imageSchema.parse(row);
    } catch (error) {
      console.error('Erro ao criar imagem no banco de dados: ', error);
      throw error;
    }
  }

  async findByStorageKey(key: string) {
    const sql = `SELECT * FROM images WHERE storage_key = @key OR thumbnail_key = @key`;

    try {
      const row = this.db.prepare(sql).get({ key });

      const safeImage = imageSchema.safeParse(row);
      if (!safeImage.success) {
        return null;
      }
      return safeImage.data;
    } catch (error) {
      console.error(
        'Não foi possivel encontrar image por storage key: ',
        error,
      );
      throw error;
    }
  }

  async findByalbumId(albumId: string) {
    const sql = `SELECT * FROM images WHERE album_id = @album_id`;

    try {
      const row = this.db.prepare(sql).all({ album_id: albumId });

      const safeImage = imagesSchema.safeParse(row);
      if (!safeImage.success) {
        return [];
      }
      return safeImage.data;
    } catch (error) {
      console.error(
        'Não foi possivel encontrar lista imagens por album ID: ',
        error,
      );
      throw error;
    }
  }

  async delete(image_id: string) {
    const sql = `DELETE FROM images WHERE id = @id`;

    try {
      this.db.prepare(sql).run({ id: image_id });
    } catch (error) {
      console.error('Não foi possivel deletar image por storage key: ', error);
      throw error;
    }
  }
}
