import { db } from 'database/connection';
import { CreateAlbumDTO } from './dtos/create-album.dto';
import { albumSchema, albumsSchema } from './dtos/album.dto';
import { UpdateAlbumDTO } from './dtos/update-album.dto';

export class AlbumRepository {
  constructor() {}

  async findById(albumId: string) {
    const sql = `
      SELECT * FROM albums
      WHERE id = ?
    `;
    try {
      const stmt = db.prepare(sql);
      const album = stmt.get(albumId);
      const safeAlbum = albumSchema.safeParse(album);
      if (!safeAlbum.success) {
        return null;
      } else {
        return safeAlbum.data;
      }
    } catch (error) {
      console.error('Error ao buscar álbum por ID:', error);
      throw error;
    }
  }

  async findAllByUserId(userId: string) {
    const sql = `
      SELECT * FROM albums WHERE user_id = ?
    `;
    try {
      const stmt = db.prepare(sql);
      const albums = stmt.all(userId);
      const safeAlbums = albumsSchema.safeParse(albums);
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
    const sqlCreate = `
      INSERT INTO albums (id, title, description, visibility, user_id)
      VALUES (?, ?, ?, ?, ?)
      RETURNING *
    `;
    const paramsCreate = [
      crypto.randomUUID(),
      newAlbumData.title,
      newAlbumData.description || null,
      newAlbumData.visibility,
      userId,
    ];

    try {
      const stmtCreate = db.prepare(sqlCreate);
      return albumSchema.parse(stmtCreate.get(paramsCreate));
    } catch (error) {
      console.error('Error ao criar álbum:', error);
      throw error;
    }
  }

  async update(
    albumId: string,
    userId: string,
    updateAlbumData: UpdateAlbumDTO,
  ) {
    const sets = Object.keys(updateAlbumData)
      .map((key) => `${key} = ?`)
      .join(', ');
    const values = Object.values(updateAlbumData);
    const sqlUpdate = `
      UPDATE albums
      SET ${sets}
      WHERE id = ? AND user_id = ?
      RETURNING *
    `;
    const paramsUpdate = [...values, albumId, userId];
    try {
      const stmtUpdate = db.prepare(sqlUpdate);
      return albumSchema.parse(stmtUpdate.get(paramsUpdate));
    } catch (error) {
      console.error('Error ao atualizar álbum:', error);
      throw error;
    }
  }

  async delete(albumId: string, userId: string) {
    const sql = `DELETE FROM albums WHERE id = ? AND user_id = ?`;
    try {
      const stmt = db.prepare(sql);
      const info = stmt.run(albumId, userId);
      return info.changes > 0;
    } catch (error) {
      console.error('Error ao deletar álbum:', error);
      throw error;
    }
  }
}
