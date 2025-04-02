
import { Pool } from 'pg';
import { ISale, ISaleRepository } from '../interfaces/sale.interface';
import { pool } from '../config/database';

export class SaleRepository implements ISaleRepository {
  private db: Pool;

  constructor() {
    this.db = pool;
  }

  async create(sale: ISale): Promise<ISale> {
    const query = `
      INSERT INTO sales (ticket_id, buyer_email, buyer_phone, amount, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [sale.ticketId, sale.buyerEmail, sale.buyerPhone, sale.amount, sale.status];
    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async findById(id: number): Promise<ISale | null> {
    const query = 'SELECT * FROM sales WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
  }

  async update(id: number, sale: Partial<ISale>): Promise<ISale> {
    const query = `
      UPDATE sales
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
    const result = await this.db.query(query, [sale.status, id]);
    return result.rows[0];
  }
}
