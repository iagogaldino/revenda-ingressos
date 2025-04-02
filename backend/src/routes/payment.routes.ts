
import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { PaymentService } from '../services/payment/payment.service';

const router = Router();
const paymentService = new PaymentService();
const paymentController = new PaymentController(paymentService);

router.post('/initialize', (req, res) => paymentController.initializePayment(req, res));
router.post('/webhook/:provider', (req, res) => paymentController.handleWebhook(req, res));

export const paymentRoutes = router;
