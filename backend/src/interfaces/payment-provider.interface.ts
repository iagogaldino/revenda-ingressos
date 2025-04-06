
export interface IPaymentProvider {
  initializePayment(amount: number, orderId: string, payer: Payer): Promise<{
    success: boolean;
    paymentUrl?: string;
    error?: string;
    qrCode?: string;
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

export interface Payer {
  name: string,
  email: string,
  phone: string
}
