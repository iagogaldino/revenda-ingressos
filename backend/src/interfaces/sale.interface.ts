
export interface ISale {
  id?: number;
  ticketId: number;
  buyerEmail: string;
  buyerPhone: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISaleRepository {
  create(sale: ISale): Promise<ISale>;
  findById(id: number): Promise<ISale | null>;
  update(id: number, sale: Partial<ISale>): Promise<ISale>;
}

export interface ISaleService {
  createSale(saleData: ISale): Promise<ISale>;
  getSaleById(id: number): Promise<ISale | null>;
  updateSaleStatus(id: number, status: ISale['status']): Promise<ISale>;
}
