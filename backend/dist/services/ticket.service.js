"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketService = void 0;
class TicketService {
    ticketRepository;
    constructor(ticketRepository) {
        this.ticketRepository = ticketRepository;
    }
    async createTicket(ticket) {
        return this.ticketRepository.create(ticket);
    }
    async getAllTickets() {
        return this.ticketRepository.findAll();
    }
    async getTicketById(id) {
        return this.ticketRepository.findById(id);
    }
    async updateTicket(id, ticket) {
        console.log('Updating ticket with ID:', id, 'Data:', ticket);
        return this.ticketRepository.update(id, ticket);
    }
    async deleteTicket(id) {
        return this.ticketRepository.delete(id);
    }
    async getTicketsBySellerId(sellerId) {
        if (!sellerId || isNaN(sellerId)) {
            throw new Error('Invalid seller ID');
        }
        return this.ticketRepository.findBySellerId(sellerId);
    }
}
exports.TicketService = TicketService;
