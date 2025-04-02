export interface IPaymentWebhook {
  ticketId: number;
  status: PaymentStatus;
  transactionId: string;
  paymentMethod: string;
  amount: number;
  timestamp: string;
}

export enum PaymentStatus {
  Accredited = 'Accredited', 
  Cancelled = 'Cancelled', 
}

export interface IPaymentService {
  validateWebhook(signature: string, payload: any): boolean;
  updateTicketStatus(webhookData: IPaymentWebhook): Promise<void>;
}
