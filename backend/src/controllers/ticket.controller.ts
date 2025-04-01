import { Request, Response } from 'express';
import { ITicketService } from '../interfaces/ticket.interface';
import { TicketService } from '../services/ticket.service';
import { TicketRepository } from '../repositories/ticket.repository';

export class TicketController {
  private ticketService: ITicketService;

  constructor() {
    const ticketRepository = new TicketRepository();
    this.ticketService = new TicketService(ticketRepository);
  }

  async getAllTickets(req: Request, res: Response) {
    try {
      const { category, minPrice, maxPrice } = req.query;
      let tickets = await this.ticketService.getAllTickets();

      if (category) {
        tickets = tickets.filter(ticket => 
          ticket.category.toLowerCase() === (category as string).toLowerCase()
        );
      }

      if (minPrice) {
        tickets = tickets.filter(ticket => ticket.price >= Number(minPrice));
      }

      if (maxPrice) {
        tickets = tickets.filter(ticket => ticket.price <= Number(maxPrice));
      }

      res.status(200).json({ success: true, data: tickets });
    } catch (error) {
      console.log('error', error);
      res.status(500).json({ success: false, error: 'Failed to fetch tickets' });
    }
  }

  async getTicketById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const ticket = await this.ticketService.getTicketById(Number(id));

      if (!ticket) {
        return res.status(404).json({ success: false, error: 'Ticket not found' });
      }

      res.status(200).json({ success: true, data: ticket });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch ticket' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const ticketData = req.body;
      const file = req.file;


      if (!this.validateTicketData(ticketData)) {
        return res.status(400).json({
          success: false,
          error: 'Missing or invalid required fields'
        });
      }

      const ticket = await this.ticketService.createTicket(ticketData, file);

      res.status(201).json({ success: true, data: ticket });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  private validateTicketData(data: any): boolean {
    return !!(
      data.eventName &&
      data.category &&
      data.location &&
      data.venue &&
      data.eventDate &&
      data.price &&
      data.quantity &&
      data.price > 0 &&
      data.quantity > 0
    );
  }
}
