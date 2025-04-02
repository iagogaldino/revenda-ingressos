
export interface IPaymentWebhook {
  ticketId: number;
  status: 'pending' | 'approved' | 'rejected';
  transactionId: string;
  paymentMethod: string;
  amount: number;
  timestamp: string;
}

export interface IPaymentService {
  validateWebhook(signature: string, payload: any): boolean;
  updateTicketStatus(webhookData: IPaymentWebhook): Promise<void>;
}
