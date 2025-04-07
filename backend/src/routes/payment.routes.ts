
import { Router, Request, Response, NextFunction } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { PaymentService } from '../services/payment/payment.service';

const router = Router();
const paymentService = new PaymentService();
const paymentController = new PaymentController(paymentService);

router.post('/initialize', (req: Request, res: Response, next: NextFunction) => 
  paymentController.initializePayment(req, res, next)
);

router.post('/webhook/:provider', (req: Request, res: Response, next: NextFunction) => 
  paymentController.handleWebhook(req, res, next)
);

export const paymentRoutes = router;
