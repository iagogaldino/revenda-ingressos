
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getPaymentStatus(paymentId: string) {
    try {
      await this.logPaymentOperation('getPaymentStatus', { paymentId });
      const response = await axios.get(`${this.baseUrl}/charge/${paymentId}`, {
        headers: {
          Authorization: this.apiKey
        }
      });
      
      return {
        status: response.data.status === 'COMPLETED' ? 'completed' : 'pending'
      };
    } catch (error) {
      return {
        status: 'failed',
        error: error.message
      };
    }
  }
}
