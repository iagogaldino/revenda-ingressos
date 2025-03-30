import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ticket } from '../../models/ticket.model';
import { TicketService } from '../../services/ticket.service';

@Component({
  standalone: false,

  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css']
})
export class TicketDetailComponent implements OnInit {
  ticket: Ticket | undefined;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const ticketId = Number(params.get('id'));
      if (!isNaN(ticketId)) {
        this.loadTicket(ticketId);
      } else {
        this.error = 'ID de ingresso inválido.';
        this.loading = false;
      }
    });
  }

  loadTicket(id: number): void {
    this.loading = true;
    this.ticketService.getTicketById(id).subscribe({
      next: (ticket) => {
        if (ticket) {
          this.ticket = ticket;
        } else {
          this.error = 'Ingresso não encontrado.';
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Não foi possível carregar os detalhes do ingresso. Por favor, tente novamente mais tarde.';
        this.loading = false;
        console.error('Erro ao carregar detalhes do ingresso:', error);
      }
    });
  }

  calculateDiscount(originalPrice: number, currentPrice: number): number {
    if (originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  goBack(): void {
    this.router.navigate(['/tickets']);
  }

  generateStarRating(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => {
      if (index < Math.floor(rating)) return 1; // full star
      if (index < rating && !Number.isInteger(rating)) return 0.5; // half star
      return 0; // empty star
    });
  }
}