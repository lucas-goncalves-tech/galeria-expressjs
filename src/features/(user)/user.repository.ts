import { db } from 'database/connection';
import { CreateUserDTO } from './dtos/create-user.dto';
import {
  UserDTO,
  userSchema,
  UserWithHashDto,
  userWithHashSchema,
} from './dtos/user.dto';

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

  async findByEmail(email: string): Promise<UserWithHashDto | null> {
    const sql = `
      SELECT * FROM users
      WHERE email = ?
    `;
    try {
      const stmt = db.prepare(sql);
      const user = stmt.get(email);
      const safeUser = userWithHashSchema.safeParse(user);
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
      const stmt = db.prepare(sql);
      stmt.run(params);
      const user = await this.findById(ID);
      const safeNewUser = userSchema.safeParse(user);
      if (!safeNewUser.success) {
        throw new Error('Error de dados ao criar novo usuário');
      }
      return safeNewUser.data;
    } catch (error) {
      throw error;
    }
  }
}
