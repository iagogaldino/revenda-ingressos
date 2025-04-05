import { Component, OnInit } from '@angular/core';
import { Ticket } from '../../models/ticket.model';
import { TicketService } from '../../services/ticket.service';
import { Category } from 'src/app/models/category.interface';

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
  categories: Category[] = [];
  selectedCategory: number = 0;
  searchTerm: string = '';
  loading: boolean = true;
  error: string | null = null;
  ticketCountByCategory: { [key: number]: number } = {};
  testimonials = [
    {
      name: 'João Silva',
      image: 'assets/user.png',
      stars: Array(5).fill(1),
      comment: 'Excelente plataforma! Muito fácil de usar e segura.'
    },
    {
      name: 'Maria Santos',
      image: 'assets/user.png',
      stars: Array(5).fill(1),
      comment: 'Comprei ingressos para vários eventos e nunca tive problemas.'
    },
    {
      name: 'Pedro Oliveira',
      image: 'assets/user.png',
      stars: Array(4).fill(1),
      comment: 'Ótimo suporte ao cliente e preços competitivos.'
    }
  ];
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
      next: (response: any) => {
        if (response && response.data) {
          this.tickets = response.data;
          this.filteredTickets = response.data;
          this.updateTicketCountByCategory();
        } else {
          this.tickets = [];
          this.filteredTickets = [];
        }
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
    console.log('Categoria selecionada:', this.selectedCategory, this.filteredTickets);
    if (this.selectedCategory) {
      this.filteredTickets = this.filteredTickets.filter(
        ticket => ticket.category === this.selectedCategory
      );
      console.log('Ingressos filtrados por categoria:', this.filteredTickets);
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

  updateTicketCountByCategory(): void {
    this.ticketCountByCategory = {};
    this.tickets.forEach(ticket => {
      if (ticket.category) {
        this.ticketCountByCategory[ticket.category] = (this.ticketCountByCategory[ticket.category] || 0) + 1;
      }
    });
  }

  onCategoryChange(): void {
    this.applyFilters();
    setTimeout(() => {
      const ticketsSection = document.querySelector('.featured-section');
      if (ticketsSection) {
        ticketsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  hasTicketsInCategory(categoryId: number): boolean {
    return this.ticketCountByCategory[categoryId] > 0;
  }

  resetFilters(): void {
    this.selectedCategory = 0;
    this.searchTerm = '';
    this.filteredTickets = this.tickets;
  }

  calculateDiscount(originalPrice: number, currentPrice: number): number {
    if (originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }
}