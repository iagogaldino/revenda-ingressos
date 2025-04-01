import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { TicketController } from '../controllers/ticket.controller';
import { categories } from '../data/mockData';

const router = Router();
const ticketController = new TicketController();

// Configuração do Multer
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
  limits: { fileSize: 5 * 1024 * 1024 }
}).single('file');

// Ticket routes
router.post('/seller/tickets', uploadMiddleware, (req, res) => ticketController.create(req, res));

router.get('/tickets', (req, res) => ticketController.getAllTickets(req, res));
router.get('/tickets/:id', (req, res) => ticketController.getTicketById(req, res));

router.get('/categories', (req, res) => {
  res.json(categories);
});

router.get('/seller/tickets', (req, res) => ticketController.getAllTickets(req, res));

export const ticketRoutes = router;
