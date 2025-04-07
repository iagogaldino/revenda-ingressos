
import { Router, Request, Response, NextFunction } from 'express';
import { TicketController } from '../controllers/ticket.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import multer from 'multer';
import { TicketService } from '../services/ticket.service';
import { TicketRepository } from '../repositories/ticket.repository';

const router = Router();
const ticketService = new TicketService(new TicketRepository());
const ticketController = new TicketController(ticketService);

// Configuração do multer
const uploadMiddleware = multer().fields([{ name: 'image' }, { name: 'file' }]);

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
