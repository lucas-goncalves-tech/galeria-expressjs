import { db } from 'database/connection';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UserDTO, userSchema } from './dtos/user.dto';
import { InternalError } from 'shared/erros/internal.error';

export class UserRepository {
  async findById(id: string): Promise<UserDTO | null> {
    const sql = `
      SELECT * FROM users
      WHERE id = ?
    `;
    try {
      const stmt = db.prepare(sql);
      const user = stmt.get(id);
      const safeUser = userSchema.safeParse(user);
      if (!safeUser.success) {
        return null;
      } else {
        return safeUser.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserDTO | null> {
    const sql = `
      SELECT * FROM users
      WHERE email = ?
    `;
    try {
      const stmt = db.prepare(sql);
      const user = stmt.get(email);
      const safeUser = userSchema.safeParse(user);
      if (!safeUser.success) {
        return null;
      } else {
        return safeUser.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async create(userData: CreateUserDTO): Promise<UserDTO> {
    const ID = crypto.randomUUID();
    const sql = `
      INSERT INTO users (id, username, email, password_hash)
      VALUES (?, ?, ?, ?)
    `;
    const params = [
      ID,
      userData.username,
      userData.email,
      userData.password_hash,
    ];

    try {
      db.exec('BEGIN TRANSACTION;');
      const stmt = db.prepare(sql);
      stmt.run(params);
      const safeNewUser = userSchema.safeParse(await this.findById(ID));
      if (!safeNewUser.success) {
        throw new InternalError();
      }
      db.exec('COMMIT');
      return safeNewUser.data;
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
  }
}
