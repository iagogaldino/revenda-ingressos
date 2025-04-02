
import { IPaymentProvider } from '../../interfaces/payment-provider.interface';
import { Providers } from '../../models/providers.enum';
import { MercadoPagoProvider } from './mercadopago.provider';
import { OpenPixProvider } from './openpix.provider';

export class PaymentService {
  private providers: Map<string, IPaymentProvider> = new Map();

  constructor() {
    // Register payment providers
    this.registerProvider(Providers.MercadoPago, new MercadoPagoProvider(
      process.env.MERCADOPAGO_API_KEY || '',
      process.env.MERCADOPAGO_API_SECRET || ''
    ));
    
    this.registerProvider(Providers.OpenPIX, new OpenPixProvider(
      process.env.OPENPIX_APP_ID || '',
      '' // OpenPix doesn't use secret
    ));
  }

  registerProvider(name: string, provider: IPaymentProvider) {
    this.providers.set(name.toLowerCase(), provider);
  }

  getProvider(name: string): IPaymentProvider {
    const provider = this.providers.get(name.toLowerCase());
    if (!provider) {
      throw new Error(`Payment provider '${name}' not found`);
    }
    return provider;
  }

  async processPayment(
    providerName: string,
    amount: number,
    orderId: string
  ) {
    const provider = this.getProvider(providerName);
    return provider.initializePayment(amount, orderId);
  }

  async confirmPayment(providerName: string, paymentId: string) {
    const provider = this.getProvider(providerName);
    return provider.confirmPayment(paymentId);
  }

  async cancelPayment(providerName: string, paymentId: string) {
    const provider = this.getProvider(providerName);
    return provider.cancelPayment(paymentId);
  }

  async getPaymentStatus(providerName: string, paymentId: string) {
    const provider = this.getProvider(providerName);
    return provider.getPaymentStatus(paymentId);
  }
}
