import fs from 'fs';

import { Router, Request, Response, NextFunction } from 'express';
import { TicketController } from '../controllers/ticket.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import multer from 'multer';
import { TicketService } from '../services/ticket.service';
import { TicketRepository } from '../repositories/ticket.repository';
import path from 'path';

const router = Router();
const ticketService = new TicketService(new TicketRepository());
const ticketController = new TicketController(ticketService);

// Verifica se a pasta 'uploads' existe, senão cria ela
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do Multer para salvar arquivos na pasta 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Pasta onde os arquivos serão salvos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`;
    cb(null, fileName);
  }
});

export const uploadMiddleware = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo inválido. Apenas JPG, PNG e PDF são permitidos.'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB por arquivo
}).fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]);

// Rotas de Tickets protegidas por autenticação
router.post('/seller/tickets', authenticateToken, uploadMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  await ticketController.create(req, res, next);
});

router.put('/seller/tickets/:id', authenticateToken, uploadMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  await ticketController.update(req, res, next);
});

router.delete('/tickets/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  await ticketController.deleteTicket(req, res, next);
});

// Rotas públicas
router.get('/tickets', async (req: Request, res: Response, next: NextFunction) => {
  await ticketController.getAllTickets(req, res, next);
});

router.get('/tickets/:id', async (req: Request, res: Response, next: NextFunction) => {
  await ticketController.getTicketById(req, res, next);
});

router.get('/tickets/download/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  await ticketController.downloadTicket(req, res, next);
});

// Rota protegida por autenticação (Busca ingressos do usuário autenticado)
router.get('/seller/tickets', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  await ticketController.getTicketsBySeller(req, res, next);
});

router.get('/tickets/seller/:sellerId', async (req: Request, res: Response, next: NextFunction) => {
  await ticketController.getTicketsBySellerId(req, res, next);
});

export const ticketRoutes = router;
