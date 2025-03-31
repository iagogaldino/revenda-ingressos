
import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseModalComponent } from '../purchase-modal/purchase-modal.component';
import { Ticket } from '../../models/ticket.model';

@Component({
  standalone: false,
  selector: 'app-ticket-card',
  templateUrl: './ticket-card.component.html',
  styleUrls: ['./ticket-card.component.css']
})
export class TicketCardComponent {
  @Input() ticket!: Ticket;

  constructor(private modalService: NgbModal) {}

  openPurchaseModal() {
    const modalRef = this.modalService.open(PurchaseModalComponent, { 
      size: 'lg',
      centered: true
    });
    modalRef.componentInstance.ticket = this.ticket;
  }

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
