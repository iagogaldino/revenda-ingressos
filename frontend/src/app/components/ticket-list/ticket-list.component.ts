import { Component, OnInit } from '@angular/core';
import { Ticket } from '../../models/ticket.model';
import { TicketService } from '../../services/ticket.service';

@Component({
  standalone: false,

  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  loading: boolean = true;
  error: string | null = null;
  sortOption: string = 'default';

  constructor(private ticketService: TicketService) { }

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading = true;
    this.ticketService.getAllTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.filteredTickets = tickets;
        this.sortTickets();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Não foi possível carregar os ingressos. Por favor, tente novamente mais tarde.';
        this.loading = false;
        console.error('Erro ao carregar ingressos:', error);
      }
    });
  }

  calculateDiscount(originalPrice: number, currentPrice: number): number {
    if (originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  filterByCategory(categoryId: number): void {
    if (!categoryId) {
      this.filteredTickets = this.tickets;
    } else {
      this.filteredTickets = this.tickets.filter(ticket => ticket.category.id === categoryId);
    }
    this.sortTickets();
  }

  filterByPriceRange(range: {min: number | null, max: number | null}): void {
    this.filteredTickets = this.tickets.filter(ticket => {
      if (range.min !== null && ticket.price < range.min) {
        return false;
      }
      if (range.max !== null && ticket.price > range.max) {
        return false;
      }
      return true;
    });
    this.sortTickets();
  }

  resetFilters(): void {
    this.filteredTickets = this.tickets;
    this.sortOption = 'default';
    this.sortTickets();
  }

  sortTickets(): void {
    switch (this.sortOption) {
      case 'price-asc':
        this.filteredTickets.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.filteredTickets.sort((a, b) => b.price - a.price);
        break;
      case 'date-asc':
        this.filteredTickets.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
        break;
      case 'date-desc':
        this.filteredTickets.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
        break;
      case 'discount':
        this.filteredTickets.sort((a, b) => {
          const discountA = this.calculateDiscount(a.originalPrice, a.price);
          const discountB = this.calculateDiscount(b.originalPrice, b.price);
          return discountB - discountA;
        });
        break;
      default:
        // Manter a ordem original
        break;
    }
  }
}