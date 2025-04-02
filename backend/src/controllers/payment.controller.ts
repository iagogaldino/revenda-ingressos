import { Request, Response } from 'express';
import { PaymentService } from '../services/payment/payment.service';
import { SaleService } from '../services/sale.service';
import { SaleRepository } from '../repositories/sale.repository';
import { Providers } from '../models/providers.enum';

export class PaymentController {
  private saleService: SaleService;

  constructor(private paymentService: PaymentService) {
    this.saleService = new SaleService(new SaleRepository());
  }

  async initializePayment(req: Request, res: Response) {
    try {
      const { provider, amount, orderId } = req.body;
      const result = await this.paymentService.processPayment(provider, amount, orderId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Payment initialization failed' });
    }
  }

  async handleWebhook(req: Request, res: Response) {
    try {
      const provider = req.params.provider;

      if (provider === Providers.OpenPIX) {
        const { correlationID, status } = req.body;
        const saleId = Number(correlationID.replace('sale_', ''));

        if (status === 'COMPLETED') {
          await this.saleService.updateSaleStatus(saleId, 'completed');
        } else if (status === 'CANCELLED') {
          await this.saleService.updateSaleStatus(saleId, 'cancelled');
        }
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Webhook handling error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }
}