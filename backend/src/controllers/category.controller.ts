
import { Request, Response } from 'express';

export class CategoryController {
  private categories: string[] = ["Shows", "Esportes", "Teatro", "Festivais", "Cinema"];

  async getCategories(req: Request, res: Response) {
    try {
      res.status(200).json({ success: true, data: this.categories });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch categories' });
    }
  }
}
