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

export interface ISaleDTO {
  id?: number;
  ticket_id: number;
  buyer_email: string;
  buyer_phone: string;
  amount: number;
  status: 'pending' | 'approved' | 'cancelled';
  created_at?: Date;
  updated_at?: Date;
}

export interface ISaleDTO {
  id?: number;
  ticket_id: number;
  buyer_email: string;
  buyer_phone: string;
  amount: number;
  status: 'pending' | 'approved' | 'cancelled';
  created_at?: Date;
  updated_at?: Date;
}

export interface ISaleRepository {
  create(sale: ISaleDTO): Promise<ISaleDTO>;
  findById(id: number): Promise<ISaleDTO | null>;
  update(id: number, sale: Partial<ISaleDTO>): Promise<ISaleDTO>;
}

export interface ISaleService {
  createSale(saleData: ISale): Promise<ISaleDTO>;
  getSaleById(id: number): Promise<ISaleDTO | null>;
  updateSaleStatus(id: number, status: ISaleDTO['status']): Promise<ISaleDTO>;
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
