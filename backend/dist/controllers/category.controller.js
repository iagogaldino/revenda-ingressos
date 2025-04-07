"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const database_1 = require("../config/database");
class CategoryController {
    async getCategories(req, res) {
        try {
            const result = await database_1.pool.query('SELECT * FROM categories ORDER BY name');
            res.status(200).json({ success: true, data: result.rows });
        }
        catch (error) {
            console.error('Error fetching categories:', error);
            res.status(500).json({ success: false, error: 'Failed to fetch categories' });
        }
    }
}
exports.CategoryController = CategoryController;
