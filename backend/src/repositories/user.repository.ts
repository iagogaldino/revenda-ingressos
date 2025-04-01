
import { IUser, IUserRepository } from '../interfaces/user.interface';
import { pool } from '../config/database';

export class UserRepository implements IUserRepository {
  async create(user: IUser): Promise<IUser> {
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [user.name, user.email, user.password]
    );
    return result.rows[0];
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  async findById(id: number): Promise<IUser | null> {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async update(id: number, user: Partial<IUser>): Promise<IUser> {
    const result = await pool.query(
      'UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), password = COALESCE($3, password) WHERE id = $4 RETURNING *',
      [user.name, user.email, user.password, id]
    );
    return result.rows[0];
  }

  async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  }
}
