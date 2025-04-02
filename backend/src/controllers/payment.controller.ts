
import { Request, Response } from 'express';
import { IPaymentWebhook } from '../interfaces/payment.interface';
import { PaymentService } from '../services/payment.service';

export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  async handleWebhook(req: Request, res: Response) {
    try {
      const signature = req.headers['x-payment-signature'] as string;
      
      if (!signature) {
        return res.status(401).json({
          success: false,
          error: 'Missing payment signature'
        });
      }

      if (!this.paymentService.validateWebhook(signature, req.body)) {
        return res.status(401).json({
          success: false,
          error: 'Invalid signature'
        });
      }

      const webhookData = req.body as IPaymentWebhook;
      
      if (!this.validateWebhookData(webhookData)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid webhook data'
        });
      }

      await this.paymentService.updateTicketStatus(webhookData);

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

  private validateWebhookData(data: any): data is IPaymentWebhook {
    return (
      typeof data.ticketId === 'number' &&
      ['pending', 'approved', 'rejected'].includes(data.status) &&
      typeof data.transactionId === 'string' &&
      typeof data.paymentMethod === 'string' &&
      typeof data.amount === 'number' &&
      typeof data.timestamp === 'string'
    );
  }
}
