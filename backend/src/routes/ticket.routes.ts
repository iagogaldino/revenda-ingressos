import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { TicketController } from '../controllers/ticket.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const ticketController = new TicketController();

// Configuração do Multer para upload de arquivos
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
      cb(new Error('Tipo de arquivo inválido. Apenas JPG, PNG e PDF são permitidos.'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).fields([{ name: 'image' }, { name: 'file' }]); // Aceitar imagem e arquivo PDF

// Rotas de Tickets protegidas por autenticação
router.post('/seller/tickets', authenticateToken, uploadMiddleware, (req, res) => ticketController.create(req, res));
router.put('/seller/tickets/:id', authenticateToken, uploadMiddleware, (req, res) => ticketController.update(req, res));
router.delete('/tickets/:id', authenticateToken, (req, res) => ticketController.deleteTicket(req, res));

// Rotas públicas
router.get('/tickets', (req, res) => ticketController.getAllTickets(req, res));
router.get('/tickets/:id', (req, res) => ticketController.getTicketById(req, res));

// Rota protegida por autenticação (Busca ingressos do usuário autenticado)
router.get('/seller/tickets', authenticateToken, ticketController.getTicketsBySeller.bind(ticketController));
router.get('/tickets/seller/:sellerId', (req, res) => ticketController.getTicketsBySellerId(req, res));

export const ticketRoutes = router;
