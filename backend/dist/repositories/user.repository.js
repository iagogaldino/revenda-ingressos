"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_1 = require("../config/database");
class UserRepository {
    async create(user) {
        const result = await database_1.pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [user.name, user.email, user.password]);
        return result.rows[0];
    }
    async findByEmail(email) {
        const result = await database_1.pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0] || null;
    }
    async findById(id) {
        const result = await database_1.pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0] || null;
    }
    async update(id, user) {
        const result = await database_1.pool.query('UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), password = COALESCE($3, password) WHERE id = $4 RETURNING *', [user.name, user.email, user.password, id]);
        return result.rows[0];
    }
    async delete(id) {
        await database_1.pool.query('DELETE FROM users WHERE id = $1', [id]);
    }
}
exports.UserRepository = UserRepository;
