"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleRepository = void 0;
const database_1 = require("../config/database");
class SaleRepository {
    db;
    constructor() {
        this.db = database_1.pool;
    }
    async create(sale) {
        const query = `
      INSERT INTO sales (ticket_id, buyer_email, buyer_phone, amount, status, buyer_name)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
        const values = [sale.ticket_id, sale.buyer_email, sale.buyer_phone, sale.amount, sale.status, sale.buyer_name];
        const result = await this.db.query(query, values);
        return result.rows[0];
    }
    async findById(id) {
        const query = 'SELECT * FROM sales WHERE id = $1';
        const result = await this.db.query(query, [id]);
        return result.rows[0] || null;
    }
    async update(id, sale) {
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
exports.SaleRepository = SaleRepository;
