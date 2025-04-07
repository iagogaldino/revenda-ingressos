
import { NextFunction, Request, Response } from 'express';
import { ITicket, ITicketService } from '../interfaces/ticket.interface';
import { TicketService } from '../services/ticket.service';
import { TicketRepository } from '../repositories/ticket.repository';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Ticket } from '../types/ticket';
import { PaymentStatus } from '../interfaces/payment.interface';
import path from 'path';
import { SaleService } from '../services/sale.service';
import { SaleRepository } from '../repositories/sale.repository';
import { YoutubeService } from '../services/youtube.service';

export class TicketController {
  private ticketService: ITicketService;

  constructor() {
    const ticketRepository = new TicketRepository();
    this.ticketService = new TicketService(ticketRepository);
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userID = (req as any).userId as number;
      if (!userID) {
        res.status(401).json({ success: false, error: 'Error: Usuário não autenticado' });
        return;
      }
      const ticketData = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const imageFile = files?.image?.[0] || null;
      const pdfFile = files?.file?.[0] || null;

      if (!this.validateTicketData(ticketData)) {
        res.status(400).json({
          success: false,
          error: 'Missing or invalid required fields'
        });
        return;
      }

      const ticket = await this.ticketService.createTicket({
        ...ticketData,
        sellerId: userID,
        status: (pdfFile?.filename ? 'active' : 'pending') as 'active' | 'pending',
        image: imageFile ? imageFile.filename : null,
        file: pdfFile ? pdfFile.filename : null,
        videoUrl: ticketData.videoUrl || null,
      });

      res.status(201).json({ success: true, data: ticket });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const ticketData = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const imageFile = files?.image?.[0] || null;
      const pdfFile = files?.file?.[0] || null;

      if (!this.validateTicketData(ticketData)) {
        res.status(400).json({
          success: false,
          error: 'Missing or invalid required fields'
        });
        return;
      }

      const youtubeService = new YoutubeService();
      const resultVideos = await youtubeService.searchVideos(`${ticketData.eventName} - Clip`, 15);
      if (resultVideos.length) {
        const mostViewedVideo = resultVideos.reduce((max, video) => (video.views > max.views ? video : max), resultVideos[0]);
        ticketData.videoUrl = mostViewedVideo.url;
      }

      let ticket = this.convertToDatabaseFormat(ticketData);

      if (imageFile && imageFile.filename && imageFile.filename != null) {
        ticket = {
          ...ticket,
          image: imageFile.filename
        }
      }
      
      if (pdfFile) {
        ticket = {
          ...ticket,
          file: pdfFile.filename
        }
      }

      const updatedTicket = await this.ticketService.updateTicket(Number(id), ticket);
      res.status(200).json({ success: true, data: updatedTicket });
    } catch (error) {
      next(error);
    }
  }

  convertToDatabaseFormat(ticketData: any) {
    return {
      id: Number(ticketData.id),
      status: ticketData.status || 'active',
      event_name: ticketData.eventName,
      event_date: this.formatDateForDatabase(ticketData.eventDate),
      location: ticketData.location,
      venue: ticketData.venue,
      price: Number(ticketData.price),
      original_price: ticketData.originalPrice ? Number(ticketData.originalPrice) : null,
      description: ticketData.description,
      category: ticketData.category,
      quantity: ticketData.quantity,
      video_url: ticketData.videoUrl,
      ticket_type: ticketData.ticketType,
    } as Partial<ITicket>;
  }

  formatDateForDatabase(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString();
  }

  async getAllTickets(req: Request, res: Response, next: NextFunction): Promise<void> {
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
      next(error);
    }
  }

  async getTicketsBySeller(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ success: false, error: 'Usuário não autenticado' });
        return;
      }
  
      const tickets = await this.ticketService.getTicketsBySellerId(req.userId);
      res.status(200).json({ success: true, data: tickets });
    } catch (error) {
      next(error);
    }
  }
  
  async getTicketById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const ticket = await this.ticketService.getTicketById(Number(id));

      if (!ticket) {
        res.status(404).json({ success: false, error: 'Ticket not found' });
        return;
      }

      res.status(200).json({ success: true, data: ticket });
    } catch (error) {
      next(error);
    }
  }

  async deleteTicket(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const ticket = await this.ticketService.getTicketById(Number(id));

      if (!ticket) {
        res.status(404).json({ success: false, error: 'Ticket not found' });
        return;
      }

      await this.ticketService.deleteTicket(Number(id));
      res.status(200).json({ success: true, message: 'Ticket deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getTicketsBySellerId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sellerId } = req.params;
      
      if (!sellerId || isNaN(Number(sellerId))) {
        res.status(400).json({
          success: false,
          error: 'Invalid seller ID provided'
        });
        return;
      }

      const tickets = await this.ticketService.getTicketsBySellerId(Number(sellerId));
      res.status(200).json({ success: true, data: tickets });
    } catch (error) {
      next(error);
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
        return;
      }

      const filePath = path.join(__dirname, '../../uploads', ticket.file);
      const originalFileName = ticket.file.split('-').slice(2).join('-');
      
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${originalFileName}"`);
      res.sendFile(filePath);
    } catch (error) {
      next(error);
    }
  }
}
