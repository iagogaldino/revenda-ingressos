import { Component, OnInit } from '@angular/core';
import { Ticket } from '../../models/ticket.model';
import { TicketService } from '../../services/ticket.service';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: string;
}

@Component({
  standalone: false,

  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  categories: string[] = [];
  selectedCategory: string = '';
  searchTerm: string = '';
  loading: boolean = true;
  error: string | null = null;
  steps: Step[] = [
    {
      number: 1,
      title: 'Encontre seu Ingresso',
      description: 'Busque entre milhares de ingressos para os mais variados eventos. Filtre por categoria, data e preço.',
      icon: 'bi-search'
    },
    {
      number: 2,
      title: 'Compre com Segurança',
      description: 'Realize sua compra de forma segura. Todos os vendedores são verificados e as transações são protegidas.',
      icon: 'bi-shield-check'
    },
    {
      number: 3,
      title: 'Receba seu Ingresso',
      description: 'Após a compra, você receberá seu ingresso por e-mail. É só apresentá-lo no dia do evento e se divertir!',
      icon: 'bi-ticket-perforated'
    }
  ];

  constructor(private ticketService: TicketService) { }

  ngOnInit(): void {
    this.loadTickets();
    this.loadCategories();
  }

  loadTickets(): void {
    this.loading = true;
    this.ticketService.getAllTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.filteredTickets = tickets;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Não foi possível carregar os ingressos. Por favor, tente novamente mais tarde.';
        this.loading = false;
        console.error('Erro ao carregar ingressos:', error);
      }
    });
  }

  loadCategories(): void {
    this.ticketService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
      }
    });
  }

  applyFilters(): void {
    this.filteredTickets = this.tickets;

    // Filtrar por categoria
    if (this.selectedCategory) {
      this.filteredTickets = this.filteredTickets.filter(
        ticket => ticket.category === this.selectedCategory
      );
    }

    // Filtrar por termo de busca
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      this.filteredTickets = this.filteredTickets.filter(
        ticket => 
          ticket.eventName.toLowerCase().includes(term) ||
          ticket.description.toLowerCase().includes(term) ||
          ticket.location.toLowerCase().includes(term) ||
          ticket.venue.toLowerCase().includes(term)
      );
    }
  }

  onSearch(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.selectedCategory = '';
    this.searchTerm = '';
    this.filteredTickets = this.tickets;
  }

  calculateDiscount(originalPrice: number, currentPrice: number): number {
    if (originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }
}