
import { ISale, ISaleService } from '../interfaces/sale.interface';
import { SaleRepository } from '../repositories/sale.repository';
import { PaymentService } from './payment/payment.service';

export class SaleService implements ISaleService {
  private paymentService: PaymentService;

  constructor(private saleRepository: SaleRepository) {
    this.paymentService = new PaymentService();
  }

  async createSale(saleData: ISale): Promise<ISale & { paymentUrl?: string }> {
    // Create the sale with pending status
    const sale = await this.saleRepository.create({
      ...saleData,
      status: 'pending'
    });

    // Generate payment with OpenPix
    const payment = await this.paymentService.processPayment(
      'openpix',
      sale.amount,
      `sale_${sale.id}`
    );

    if (!payment.success) {
      console.log(payment);
      throw new Error('Failed to generate payment');
    }

    // Return sale with payment URL
    return {
      ...sale,
      paymentUrl: payment.paymentUrl
    };
  }

  async getSaleById(id: number): Promise<ISale | null> {
    return this.saleRepository.findById(id);
  }

  async updateSaleStatus(id: number, status: ISale['status']): Promise<ISale> {
    return this.saleRepository.update(id, { status });
  }
}
