import { Database } from 'better-sqlite3';
import { IImageCreate } from './interfaces/IImageCreate';
import { imageSchema } from './dtos/image.dto';

export class ImageRepository {
  constructor(private readonly db: Database) {}

  async create(imageData: IImageCreate) {
    const sql = `INSERT INTO "images" 
    (id, album_id, storage_key, original_name, mime_type, size)
    VALUES (@id, @album_id, @storage_key, @original_name, @mime_type, @size)
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

  async findByStorageKey(storage_key: string) {
    const sql = `SELECT * FROM images WHERE storage_key = @storage_key`;

    try {
      const row = this.db.prepare(sql).get({ storage_key });

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
}
