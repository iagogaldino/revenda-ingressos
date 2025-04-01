
export interface ITicket {
  id?: number;
  eventName: string;
  description: string;
  category: string;
  location: string;
  venue: string;
  eventDate: string;
  price: number;
  quantity: number;
  ticket?: string;
  image?: string;
  file?: string;
  sellerId: number;
  status: 'active' | 'pending';
  createdAt?: string;
  updatedAt?: string;
}

export interface ITicketRepository {
  create(ticket: ITicket): Promise<ITicket>;
  findAll(): Promise<ITicket[]>;
  findById(id: number): Promise<ITicket | null>;
  update(id: number, ticket: Partial<ITicket>): Promise<ITicket>;
  delete(id: number): Promise<void>;
}

export interface ITicketService {
  createTicket(ticket: ITicket, file?: Express.Multer.File): Promise<ITicket>;
  getAllTickets(): Promise<ITicket[]>;
  getTicketById(id: number): Promise<ITicket | null>;
  updateTicket(id: number, ticket: Partial<ITicket>): Promise<ITicket>;
  deleteTicket(id: number): Promise<void>;
}
