import { Component, Input } from '@angular/core';
import { Ticket } from '../../models/ticket.model';

@Component({
  standalone: false,

  selector: 'app-ticket-card',
  templateUrl: './ticket-card.component.html',
  styleUrls: ['./ticket-card.component.css']
})
export class TicketCardComponent {
  @Input() ticket!: Ticket;

  calculateDiscount(originalPrice: number, currentPrice: number): number {
    if (originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  generateStarRating(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => {
      if (index < Math.floor(rating)) return 1; // full star
      if (index < rating && !Number.isInteger(rating)) return 0.5; // half star
      return 0; // empty star
    });
  }
}