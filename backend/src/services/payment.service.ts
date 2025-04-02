
import { IPaymentService, IPaymentWebhook } from '../interfaces/payment.interface';
import { TicketService } from './ticket.service';
import crypto from 'crypto';

export class PaymentService implements IPaymentService {
  constructor(private ticketService: TicketService) {}

  validateWebhook(signature: string, payload: any): boolean {
    const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET;
    const computedSignature = crypto
      .createHmac('sha256', webhookSecret || '')
      .update(JSON.stringify(payload))
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(computedSignature)
    );
  }

  async updateTicketStatus(webhookData: IPaymentWebhook): Promise<void> {
    const ticket = await this.ticketService.getTicketById(webhookData.ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const paymentStatus = webhookData.status;
    await this.ticketService.updateTicket(webhookData.ticketId, { paymentStatus });
  }
}
