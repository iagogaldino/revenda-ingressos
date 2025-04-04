
import { ITicket, ITicketService, ITicketRepository } from '../interfaces/ticket.interface';

export class TicketService implements ITicketService {
  constructor(private readonly ticketRepository: ITicketRepository) {}

  async createTicket(ticket: ITicket): Promise<ITicket> {
    return this.ticketRepository.create(ticket);
  }

  async getAllTickets(): Promise<ITicket[]> {
    return this.ticketRepository.findAll();
  }

  async getTicketById(id: number): Promise<ITicket | null> {
    return this.ticketRepository.findById(id);
  }

  async updateTicket(id: number, ticket: Partial<ITicket>): Promise<ITicket> {
    console.log('Updating ticket with ID:', id, 'Data:', ticket);
    return this.ticketRepository.update(id, ticket);
  }

  async deleteTicket(id: number): Promise<void> {
    return this.ticketRepository.delete(id);
  }

  async getTicketsBySellerId(sellerId: number): Promise<ITicket[]> {
    if (!sellerId || isNaN(sellerId)) {
      throw new Error('Invalid seller ID');
    }
    return this.ticketRepository.findBySellerId(sellerId);
  }
}
