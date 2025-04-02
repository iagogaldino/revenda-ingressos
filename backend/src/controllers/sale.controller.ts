
import { Request, Response } from 'express';
import { SaleService } from '../services/sale.service';

export class SaleController {
  constructor(private saleService: SaleService) {}

  async createSale(req: Request, res: Response) {
    try {
      const sale = await this.saleService.createSale(req.body);
      res.status(201).json(sale);
    } catch (error) {
      console.error('Error creating sale:', error);
      res.status(500).json({ error: 'Failed to create sale' });
    }
  }
}
