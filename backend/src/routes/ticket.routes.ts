
import { Router } from 'express';
import { TicketController } from '../controllers/ticket.controller';
import { mockTickets, categories } from '../data/mockData';

const router = Router();
const ticketController = new TicketController();

// Ticket routes
router.post('/seller/tickets', ticketController.create);

router.get('/tickets', (req, res) => ticketController.getAllTickets(req, res));
router.get('/tickets/:id', (req, res) => ticketController.getTicketById(req, res));

router.get('/categories', (req, res) => {
  res.json(categories);
});

router.get('/seller/tickets', (req, res) => ticketController.getAllTickets(req, res));

export const ticketRoutes = router;
