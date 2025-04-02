
export interface IPaymentProvider {
  initializePayment(amount: number, orderId: string): Promise<{
    success: boolean;
    paymentUrl?: string;
    error?: string;
  }>;

  confirmPayment(paymentId: string): Promise<{
    success: boolean;
    transactionId?: string;
    error?: string;
  }>;

  cancelPayment(paymentId: string): Promise<{
    success: boolean;
    error?: string;
  }>;

  getPaymentStatus(paymentId: string): Promise<{
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    error?: string;
  }>;
}
