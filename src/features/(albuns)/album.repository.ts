import { CreateAlbumDTO } from './dtos/create-album.dto';
import { albumSchema, albumsSchema } from './dtos/album.dto';
import { UpdateAlbumDTO } from './dtos/update-album.dto';
import { Database } from 'better-sqlite3';

export class AlbumRepository {
  constructor(private readonly db: Database) {}

  async findById(albumId: string) {
    const sql = `
      SELECT * FROM albums
      WHERE id = @id
    `;
    try {
      const row = this.db.prepare(sql).get({ id: albumId });
      const safeAlbum = albumSchema.safeParse(row);
      if (!safeAlbum.success) {
        return null;
      }
      return safeAlbum.data;
    } catch (error) {
      console.error('Error ao buscar álbum por ID:', error);
      throw error;
    }
  }

  async findAllByUserId(userId: string) {
    const sql = `
      SELECT * FROM albums WHERE user_id = @user_id
    `;
    try {
      const rows = this.db.prepare(sql).all({ user_id: userId });
      const safeAlbums = albumsSchema.safeParse(rows);
      if (!safeAlbums.success) {
        return [];
      }
      return safeAlbums.data;
    } catch (error) {
      console.error('Error ao buscar todos os álbuns:', error);
      throw error;
    }
  }

  async create(newAlbumData: CreateAlbumDTO, userId: string) {
    const sql = `
      INSERT INTO albums (id, title, description, visibility, user_id)
      VALUES (@id, @title, @description, @visibility, @user_id)
      RETURNING *
    `;

    try {
      const row = this.db.prepare(sql).get({
        id: crypto.randomUUID(),
        title: newAlbumData.title,
        description: newAlbumData.description || null,
        visibility: newAlbumData.visibility,
        user_id: userId,
      });
      return albumSchema.parse(row);
    } catch (error) {
      console.error('Error ao criar álbum:', error);
      throw error;
    }
  }

  async update(
    updateAlbumData: UpdateAlbumDTO,
    albumId: string,
    userId: string,
  ) {
    const sets = Object.keys(updateAlbumData)
      .map((key) => `${key} = ?`)
      .join(', ');
    const values = Object.values(updateAlbumData);
    const sql = `
      UPDATE albums
      SET ${sets}
      WHERE id = @id AND user_id = @user_id
      RETURNING *
    `;
    try {
      const row = this.db.prepare(sql).get(...values, {
        id: albumId,
        user_id: userId,
      });
      return albumSchema.parse(row);
    } catch (error) {
      console.error('Error ao atualizar álbum:', error);
      throw error;
    }
  }

  async updateCover(albumId: string, storageKey: string | null) {
    const sql = `UPDATE "albums" SET cover_image_key = @cover_image_key WHERE id = @id`;
    try {
      this.db.prepare(sql).run({
        cover_image_key: storageKey,
        id: albumId,
      });
    } catch (error) {
      console.error('Error ao atualizar album cover image: ', error);
      throw error;
    }
  }

  async delete(albumId: string, userId: string) {
    const sql = `DELETE FROM albums WHERE id = @id AND user_id = @user_id`;
    try {
      const info = this.db.prepare(sql).run({ id: albumId, user_id: userId });
      return info.changes > 0;
    } catch (error) {
      console.error('Error ao deletar álbum:', error);
      throw error;
    }
  }
}
