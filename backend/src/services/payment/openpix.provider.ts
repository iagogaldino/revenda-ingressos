
import axios from 'axios';
import { BasePaymentProvider } from './base-payment.provider';

export class OpenPixProvider extends BasePaymentProvider {
  private baseUrl = 'https://api.openpix.com.br/api/v1';

  async initializePayment(amount: number, orderId: string) {
    try {
      await this.logPaymentOperation('initializePayment', { amount, orderId });
      
      const response = await axios.post(
        `${this.baseUrl}/charge`,
        {
          correlationID: orderId,
          value: amount * 100, // Convert to centavos
          comment: `Pagamento do pedido ${orderId}`,
          customer: {
            name: "Cliente",
            email: "cliente@email.com",
            phone: "5511999999999"
          }
        },
        {
          headers: {
            Authorization: this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        paymentUrl: response.data.qrCodeImage,
        transactionId: response.data.id
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async confirmPayment(paymentId: string) {
    try {
      await this.logPaymentOperation('confirmPayment', { paymentId });
      return {
        success: true,
        transactionId: paymentId
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async cancelPayment(paymentId: string) {
    try {
      await this.logPaymentOperation('cancelPayment', { paymentId });
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getPaymentStatus(paymentId: string): Promise<{
    status: 'completed' | 'pending' | 'failed' | 'cancelled';
    error?: string;
  }> {
    try {
      await this.logPaymentOperation('getPaymentStatus', { paymentId });
      const response = await axios.get(`${this.baseUrl}/charge/${paymentId}`, {
        headers: {
          Authorization: this.apiKey
        }
      });
      
      let status: 'completed' | 'pending' | 'failed' | 'cancelled';
      switch (response.data.status) {
        case 'COMPLETED':
          status = 'completed';
          break;
        case 'CANCELLED':
          status = 'cancelled';
          break;
        case 'FAILED':
          status = 'failed';
          break;
        default:
          status = 'pending';
      }
      
      return { status };
    } catch (error: any) {
      return {
        status: 'failed',
        error: error.message
      };
    }
  }
}
