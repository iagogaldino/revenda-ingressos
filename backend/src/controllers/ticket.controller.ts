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

  async create(req: Request, res: Response) {
    try {
      const ticketData = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      // Validar se os arquivos foram enviados corretamente
      const imageFile = files?.image?.[0] || null;
      const pdfFile = files?.file?.[0] || null;

      if (!this.validateTicketData(ticketData)) {
        return res.status(400).json({
          success: false,
          error: 'Missing or invalid required fields'
        });
      }

      const ticket = await this.ticketService.createTicket({
        ...ticketData,
        image: imageFile ? imageFile.filename : null,
        file: pdfFile ? pdfFile.filename : null,
      });

      res.status(201).json({ success: true, data: ticket });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const ticketData = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const imageFile = files?.image?.[0] || null;
      const pdfFile = files?.file?.[0] || null;

      if (!this.validateTicketData(ticketData)) {
        return res.status(400).json({
          success: false,
          error: 'Missing or invalid required fields'
        });
      }

      const updatedTicket = await this.ticketService.updateTicket(Number(id), {
        ...ticketData,
        image: imageFile ? imageFile.filename : null,
        file: pdfFile ? pdfFile.filename : null,
      });

      res.status(200).json({ success: true, data: updatedTicket });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
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

  async deleteTicket(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const ticket = await this.ticketService.getTicketById(Number(id));

      if (!ticket) {
        return res.status(404).json({ success: false, error: 'Ticket not found' });
      }

      await this.ticketService.deleteTicket(Number(id));
      res.status(200).json({ success: true, message: 'Ticket deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to delete ticket' });
    }
  }

  async getTicketsBySellerId(req: Request, res: Response) {
    try {
      const { sellerId } = req.params;
      
      if (!sellerId || isNaN(Number(sellerId))) {
        return res.status(400).json({
          success: false,
          error: 'Invalid seller ID provided'
        });
      }

      const tickets = await this.ticketService.getTicketsBySellerId(Number(sellerId));
      res.status(200).json({ success: true, data: tickets });
    } catch (error) {
      console.error('Error fetching seller tickets:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch seller tickets'
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
