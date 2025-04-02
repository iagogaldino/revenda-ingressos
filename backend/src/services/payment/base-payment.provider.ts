
import { IPaymentProvider } from '../../interfaces/payment-provider.interface';

export abstract class BasePaymentProvider implements IPaymentProvider {
  constructor(protected apiKey: string, protected apiSecret: string) {}

  abstract initializePayment(amount: number, orderId: string): Promise<{
    success: boolean;
    paymentUrl?: string;
    error?: string;
  }>;

  abstract confirmPayment(paymentId: string): Promise<{
    success: boolean;
    transactionId?: string;
    error?: string;
  }>;

  abstract cancelPayment(paymentId: string): Promise<{
    success: boolean;
    error?: string;
  }>;

  abstract getPaymentStatus(paymentId: string): Promise<{
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    error?: string;
  }>;

  protected async logPaymentOperation(operation: string, data: any): Promise<void> {
    console.log(`[${this.constructor.name}] ${operation}:`, data);
  }
}
