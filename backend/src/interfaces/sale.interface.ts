
export interface ISale {
  id?: number;
  ticketId: number;
  buyerEmail: string;
  buyerPhone: string;
  amount: number;
  status: 'pending' | 'approved' | 'cancelled';
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



export interface SaleDataResponse {
  sale: Sale;
  payment: Payment;
}

export interface Sale {
  id: number;
  ticket_id: number;
  buyer_email: string;
  buyer_phone: string;
  amount: string;
  status: 'pending' | 'approved' | 'cancelled';
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface Payment {
  status: 'pending' | 'approved' | 'cancelled';
}
