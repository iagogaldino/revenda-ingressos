
import { Request, Response } from 'express';
import { PaymentService } from '../services/payment/payment.service';

export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  async initializePayment(req: Request, res: Response) {
    try {
      const { provider, amount, orderId } = req.body;

      if (!provider || !amount || !orderId) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameters'
        });
      }

      const result = await this.paymentService.processPayment(
        provider,
        amount,
        orderId
      );

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async handleWebhook(req: Request, res: Response) {
    try {
      const { provider } = req.params;
      const signature = req.headers['x-payment-signature'] as string;
      
      if (!signature) {
        return res.status(401).json({
          success: false,
          error: 'Missing payment signature'
        });
      }

      const paymentProvider = this.paymentService.getProvider(provider);
      const webhookData = req.body;

      // Process webhook data according to provider
      // Implementation will vary based on provider requirements

      res.status(200).json({
        success: true,
        message: 'Webhook processed successfully'
      });
    } catch (error) {
      console.error('Payment webhook error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process payment webhook'
      });
    }
  }
}
