
import { Request, Response } from 'express';
import multer from 'multer';
import { RequestHandler } from 'express';
import path from 'path';
import { ITicketService } from '../interfaces/ticket.interface';
import { TicketService } from '../services/ticket.service';
import { TicketRepository } from '../repositories/ticket.repository';

const uploadMiddleware = multer({
  storage: multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG and PDF files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

const upload = uploadMiddleware.single('file');

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
        tickets = tickets.filter(ticket => 
          ticket.price >= Number(minPrice)
        );
      }

      if (maxPrice) {
        tickets = tickets.filter(ticket => 
          ticket.price <= Number(maxPrice)
        );
      }

      res.status(200).json({
        success: true,
        data: tickets
      });
    } catch (error) {
      console.log('error', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to fetch tickets'
        }
      });
    }
  }

  async getTicketById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const ticket = await this.ticketService.getTicketById(Number(id));

      if (!ticket) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Ticket not found'
          }
        });
      }

      res.status(200).json({
        success: true,
        data: ticket
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to fetch ticket'
        }
      });
    }
  }

  async create(req: any, res: any) {
    try {
      upload(req, res, async (err: any) => {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'UPLOAD_ERROR',
              message: err.message
            }
          });
        }

        const ticketData = req.body;

        if (!this.validateTicketData(ticketData)) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Missing required fields'
            }
          });
        }

        const ticket = await this.ticketService.createTicket(ticketData, req.file);

        res.status(201).json({
          success: true,
          data: ticket
        });
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Internal server error'
        }
      });
    }
  }

  private validateTicketData(data: any): boolean {
    return !!(data.eventName && data.category && data.location && 
              data.venue && data.eventDate && data.price && data.quantity &&
              data.price > 0 && data.quantity > 0);
  }
}
