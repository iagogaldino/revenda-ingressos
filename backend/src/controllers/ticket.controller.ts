
import { Request, Response } from 'express';
import multer from 'multer';
import { Express } from 'express';
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

  async create(req: Request, res: Response) {
    try {
      upload(req as any as Express.Request, res, async (err) => {
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
