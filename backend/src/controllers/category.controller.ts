
import { Request, Response } from 'express';
import { pool } from '../config/database';

export class CategoryController {
  async getCategories(req: Request, res: Response) {
    try {
      const result = await pool.query('SELECT * FROM categories ORDER BY name');
      res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch categories' });
    }
  }
}
