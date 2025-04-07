import { TokenService } from './../services/token.service';
import { TicketService } from './../services/ticket.service';
import { TicketRepository } from './../repositories/ticket.repository';

import { NextFunction, Request, Response } from 'express';
import { SaleService } from '../services/sale.service';
import { TicketController } from '../controllers/ticket.controller';

export class SaleController {
  constructor(private saleService: SaleService) {}

  async createSale(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sale = await this.saleService.createSale(req.body);
      res.status(201).json({
        sale,
        payment: {
          qrCodeUrl: sale.paymentUrl,
          status: 'pending'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getSaleStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const saleId = parseInt(req.params.id);
      
      if (isNaN(saleId)) {
        res.status(400).json({ error: 'Invalid sale ID' });
        return;
      }

      const sale = await this.saleService.getSaleById(saleId);
      
      if (!sale) {
        res.status(404).json({ error: 'Sale not found' });
        return;
      }

      const ticketRepository = new TicketRepository();
      const ticketService = new TicketService(ticketRepository);
      const ticket = await ticketService.getTicketById(sale.ticket_id as number);
      const token = new TokenService().generateToken({ saleID: sale.id as number });

      res.json({
        token: sale.status === 'approved' ? token : null,
        ticket: sale.status === 'approved' ? ticket?.file : null,
        saleId: sale.id,
        status: sale.status,
        payment: {
          status: sale.status === 'approved' ? 'completed' : 
                 sale.status === 'cancelled' ? 'cancelled' : 'pending'
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
