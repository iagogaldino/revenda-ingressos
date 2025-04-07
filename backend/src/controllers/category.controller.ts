
import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/database';

export class CategoryController {
  async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await pool.query('SELECT * FROM categories ORDER BY name');
      res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      next(error);
    }
  }
}
