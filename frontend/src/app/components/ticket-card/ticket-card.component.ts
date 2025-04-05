
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
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
  @ViewChild('videoPreview') videoPreview!: ElementRef<HTMLVideoElement>;
  
  isVideoVisible = false;

  constructor(private modalService: NgbModal) {}

  getYouTubeEmbedUrl(url: string): string {
    const videoId = this.extractYouTubeVideoId(url);
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
  }

  private extractYouTubeVideoId(url: string): string {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  }

  showVideo() {
    if (this.ticket.videoUrl) {
      this.isVideoVisible = true;
    }
  }

  hideVideo() {
    if (this.ticket.videoUrl) {
      this.isVideoVisible = false;
    }
  }

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

  onImageError(event: Event): void {
    console.log('error');
    (event.target as HTMLImageElement).src = 'assets/placeholder-event.jpg';
  }
}
