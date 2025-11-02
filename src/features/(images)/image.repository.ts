import { Database } from 'better-sqlite3';
import { IImageCreate } from './interfaces/IImageCreate';
import { imageSchema } from './dtos/image.dto';

export class ImageRepository {
  constructor(private readonly db: Database) {}

  async create(imageData: IImageCreate) {
    const sql = `INSERT INTO "images" 
    (id, album_id, storage_key, original_name, mime_type, size)
    VALUES ($id, $album_id, $storage_key, $original_name, $mime_type, $size)
    RETURNING *`;
    const newImage = {
      ...imageData,
      id: crypto.randomUUID(),
    };
    try {
      const stmt = this.db.prepare(sql);
      return imageSchema.parse(stmt.get(newImage));
    } catch (error) {
      console.error('Erro ao criar imagem no banco de dados: ', error);
      throw error;
    }
  }
}
