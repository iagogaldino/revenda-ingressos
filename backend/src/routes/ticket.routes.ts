
import { Router, Request, Response, NextFunction } from 'express';
import { TicketController } from '../controllers/ticket.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import multer from 'multer';
import { TicketService } from '../services/ticket.service';
import { TicketRepository } from '../repositories/ticket.repository';

const router = Router();
const ticketService = new TicketService(new TicketRepository());
const ticketController = new TicketController(ticketService);

const uploadMiddleware = multer().fields([{ name: 'image' }, { name: 'file' }]);

router.post('/seller/tickets', authenticateToken, uploadMiddleware, (req: Request, res: Response, next: NextFunction) => {
  ticketController.create(req, res, next);
});

router.put('/seller/tickets/:id', authenticateToken, uploadMiddleware, (req: Request, res: Response, next: NextFunction) => {
  ticketController.update(req, res, next);
});

router.delete('/tickets/:id', authenticateToken, (req: Request, res: Response, next: NextFunction) => {
  ticketController.deleteTicket(req, res, next);
});

router.get('/tickets', (req: Request, res: Response, next: NextFunction) => {
  ticketController.getAllTickets(req, res, next);
});

router.get('/tickets/:id', (req: Request, res: Response, next: NextFunction) => {
  ticketController.getTicketById(req, res, next);
});

router.get('/tickets/download/:id', authenticateToken, (req: Request, res: Response, next: NextFunction) => {
  ticketController.downloadTicket(req, res, next);
});

router.get('/seller/tickets', authenticateToken, (req: Request, res: Response, next: NextFunction) => {
  ticketController.getTicketsBySeller(req, res, next);
});

router.get('/tickets/seller/:sellerId', (req: Request, res: Response, next: NextFunction) => {
  ticketController.getTicketsBySellerId(req, res, next);
});

export const ticketRoutes = router;
