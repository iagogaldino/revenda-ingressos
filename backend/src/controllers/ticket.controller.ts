import { Request, Response, NextFunction } from 'express';
import { TicketService } from '../services/ticket.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import path from 'path';
import { SaleService } from '../services/sale.service';
import { SaleRepository } from '../repositories/sale.repository';

export class TicketController {
  private ticketService: TicketService;

  constructor(ticketService: TicketService) {
    this.ticketService = ticketService;
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userID = (req as AuthRequest).userId as number;
      const ticketData = req.body;
      const result = await this.ticketService.createTicket(ticketData);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ticketId = Number(req.params.id);
      const ticketData = req.body;
      const result = await this.ticketService.updateTicket(ticketId, ticketData);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteTicket(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ticketId = Number(req.params.id);
      await this.ticketService.deleteTicket(ticketId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getAllTickets(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tickets = await this.ticketService.getAllTickets();
      res.status(200).json(tickets);
    } catch (error) {
      next(error);
    }
  }

  async getTicketById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ticketId = Number(req.params.id);
      const ticket = await this.ticketService.getTicketById(ticketId);
      res.status(200).json(ticket);
    } catch (error) {
      next(error);
    }
  }

  async downloadTicket(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.tokenDecoded?.saleID as number;
      if (!id) {
        res.status(404).json({ success: false, error: 'Error sale id' });
        return;
      }

      const saleService = new SaleService(new SaleRepository());
      const sale = await saleService.getSaleById(Number(id));

      if (!sale) {
        res.status(404).json({ success: false, error: 'Sale not found' });
        return;
      }

      if (sale.status !== 'approved') {
        res.status(403).json({ success: false, error: 'Payment not approved' });
        return;
      }

      const ticket = await this.ticketService.getTicketById(sale.ticket_id);

      if (!ticket || !ticket.file) {
        res.status(404).json({ success: false, error: 'Ticket file not found' });
      } else {

      const filePath = path.join(__dirname, '../../uploads', ticket.file);
      const originalFileName = ticket.file.split('-').slice(2).join('-');
      
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${originalFileName}"`);
      res.sendFile(filePath);
      }
    } catch (error) {
      next(error);
    }
  }

  async getTicketsBySeller(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userID = (req as AuthRequest).userId as number;
      const tickets = await this.ticketService.getTicketsBySellerId(userID);
      res.status(200).json(tickets);
    } catch (error) {
      next(error);
    }
  }

  async getTicketsBySellerId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sellerId = Number(req.params.sellerId);
      const tickets = await this.ticketService.getTicketsBySellerId(sellerId);
      res.status(200).json(tickets);
    } catch (error) {
      next(error);
    }
  }
}
