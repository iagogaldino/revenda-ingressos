
import { ITicket, ITicketRepository } from '../interfaces/ticket.interface';
import { mockTickets } from '../data/mockData';

export class TicketRepository implements ITicketRepository {
  private tickets: ITicket[] = mockTickets;

  async create(ticket: ITicket): Promise<ITicket> {
    const newTicket = {
      ...ticket,
      id: Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tickets.push(newTicket);
    return newTicket;
  }

  async findAll(): Promise<ITicket[]> {
    return this.tickets;
  }

  async findById(id: number): Promise<ITicket | null> {
    return this.tickets.find(ticket => ticket.id === id) || null;
  }

  async update(id: number, ticket: Partial<ITicket>): Promise<ITicket> {
    const index = this.tickets.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Ticket not found');
    
    this.tickets[index] = {
      ...this.tickets[index],
      ...ticket,
      updatedAt: new Date().toISOString()
    };
    
    return this.tickets[index];
  }

  async delete(id: number): Promise<void> {
    const index = this.tickets.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Ticket not found');
    this.tickets.splice(index, 1);
  }
}
