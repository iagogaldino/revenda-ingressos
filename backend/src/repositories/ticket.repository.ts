
import { ITicket, ITicketRepository } from '../interfaces/ticket.interface';
import { pool } from '../config/database';

export class TicketRepository implements ITicketRepository {
  async create(ticket: ITicket): Promise<ITicket> {
    console.log('reposi', ticket);
    const query = `
      INSERT INTO tickets (
        seller_id, status, event_name, event_date, location, venue,
        price, description, category, image, file, quantity, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
      RETURNING *
    `;
  
    const values = [
      ticket.sellerId,
      ticket.status,
      ticket.eventName,
      ticket.eventDate,
      ticket.location,
      ticket.venue,
      ticket.price,
      ticket.description,
      ticket.category,
      ticket.image,   // Caminho ou URL da imagem
      ticket.file,    // Caminho ou URL do arquivo PDF
      ticket.quantity
    ];
  
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
  async findAll(): Promise<ITicket[]> {
    const result = await pool.query('SELECT * FROM tickets WHERE active = true ORDER BY created_at DESC');
    return result.rows;
  }

  async findById(id: number): Promise<ITicket | null> {
    const result = await pool.query('SELECT * FROM tickets WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async update(id: number, ticket: Partial<ITicket>): Promise<ITicket> {
    const keys = Object.keys(ticket);
    const values = Object.values(ticket);
    
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    const query = `
      UPDATE tickets 
      SET ${setClause}, updated_at = NOW()
      WHERE id = $${keys.length + 1}
      RETURNING *
    `;

    const result = await pool.query(query, [...values, id]);
    return result.rows[0];
  }

  async delete(id: number): Promise<void> {
    await pool.query('UPDATE tickets SET active = false WHERE id = $1', [id]);
  }

  async findBySellerId(sellerId: number): Promise<ITicket[]> {
    const result = await pool.query(
      'SELECT * FROM tickets WHERE seller_id = $1 AND active = true ORDER BY created_at DESC',
      [sellerId]
    );
    return result.rows;
  }
}
