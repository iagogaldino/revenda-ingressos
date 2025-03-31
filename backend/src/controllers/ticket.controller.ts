
import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { CreateTicketDTO } from '../types/ticket';

const upload = multer({
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
}).single('file');

export class TicketController {
  async create(req: Request, res: Response) {
    try {
      upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'UPLOAD_ERROR',
              message: err.message
            }
          });
        }

        const ticketData: CreateTicketDTO = req.body;

        // Validações básicas
        if (!ticketData.eventName || !ticketData.category || !ticketData.location || 
            !ticketData.venue || !ticketData.eventDate || !ticketData.price || !ticketData.quantity) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Missing required fields'
            }
          });
        }

        if (ticketData.price <= 0 || ticketData.quantity <= 0) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Price and quantity must be positive numbers'
            }
          });
        }

        // Mock da criação do ticket
        const ticket = {
          ...ticketData,
          id: Math.floor(Math.random() * 1000),
          sellerId: 1, // Mock do ID do vendedor
          status: req.file ? 'active' : 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          fileUrl: req.file ? `/uploads/${req.file.filename}` : undefined
        };

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
}
