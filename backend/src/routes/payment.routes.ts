
import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { PaymentService } from '../services/payment.service';
import { TicketService } from '../services/ticket.service';
import { TicketRepository } from '../repositories/ticket.repository';

const router = Router();
const ticketRepository = new TicketRepository();
const ticketService = new TicketService(ticketRepository);
const paymentService = new PaymentService(ticketService);
const paymentController = new PaymentController(paymentService);

router.post('/webhook', (req, res) => paymentController.handleWebhook(req, res));

export const paymentRoutes = router;
