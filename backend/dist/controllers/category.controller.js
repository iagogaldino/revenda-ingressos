"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const database_1 = require("../config/database");
class CategoryController {
    async getCategories(req, res, next) {
        try {
            const result = await database_1.pool.query('SELECT * FROM categories ORDER BY name');
            res.status(200).json({ success: true, data: result.rows });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CategoryController = CategoryController;
