
import { ISale, ISaleService } from '../interfaces/sale.interface';
import { SaleRepository } from '../repositories/sale.repository';

export class SaleService implements ISaleService {
  constructor(private saleRepository: SaleRepository) {}

  async createSale(saleData: ISale): Promise<ISale> {
    return this.saleRepository.create({
      ...saleData,
      status: 'pending'
    });
  }

  async getSaleById(id: number): Promise<ISale | null> {
    return this.saleRepository.findById(id);
  }

  async updateSaleStatus(id: number, status: ISale['status']): Promise<ISale> {
    return this.saleRepository.update(id, { status });
  }
}
