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
      WHERE id = @id
    `;
    try {
      const row = db.prepare(sql).get({ id });
      const safeUser = userSchema.safeParse(row);
      if (!safeUser.success) {
        return null;
      } else {
        return safeUser.data;
      }
    } catch (error) {
      console.error('Error ao buscar usuário por ID:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserWithHashDto | null> {
    const sql = `
      SELECT * FROM users
      WHERE email = @email
    `;
    try {
      const row = db.prepare(sql).get({ email });
      const safeUser = userWithHashSchema.safeParse(row);
      if (!safeUser.success) {
        return null;
      } else {
        return safeUser.data;
      }
    } catch (error) {
      console.error('Error ao buscar usuário por email:', error);
      throw error;
    }
  }

  async create(userData: CreateUserDTO): Promise<UserDTO> {
    const id = crypto.randomUUID();
    const sql = `
      INSERT INTO users (id, name, email, password_hash)
      VALUES (@id, @name, @email, @password_hash)
      RETURNING *
    `;

    try {
      const row = db.prepare(sql).get({ id, ...userData });

      const safeNewUser = userSchema.safeParse(row);
      if (!safeNewUser.success) {
        throw new Error('Error de dados ao criar novo usuário');
      }
      return safeNewUser.data;
    } catch (error) {
      console.error('Error ao criar novo usuário:', error);
      throw error;
    }
  }
}
