
import { ITicket, ITicketService, ITicketRepository } from '../interfaces/ticket.interface';

export class TicketService implements ITicketService {
  constructor(private readonly ticketRepository: ITicketRepository) {}

  async createTicket(ticket: ITicket, file?: Express.Multer.File): Promise<ITicket> {
    ticket.sellerId = 1; // Retirar esse valor fixo quando tiver código de sessão do usuario
    const ticketData = {
      ...ticket,
      status: (file ? 'active' : 'pending') as 'active' | 'pending',
      imageUrl: file ? `/uploads/${file.filename}` : undefined
    };
    console.log('createTicket', ticketData);
    return this.ticketRepository.create(ticketData);
  }

  async getAllTickets(): Promise<ITicket[]> {
    return this.ticketRepository.findAll();
  }

  async getTicketById(id: number): Promise<ITicket | null> {
    return this.ticketRepository.findById(id);
  }

  async updateTicket(id: number, ticket: Partial<ITicket>): Promise<ITicket> {
    return this.ticketRepository.update(id, ticket);
  }

  async deleteTicket(id: number): Promise<void> {
    return this.ticketRepository.delete(id);
  }
}
