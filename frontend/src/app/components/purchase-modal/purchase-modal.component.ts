
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Ticket } from '../../models/ticket.model';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import * as QRCode from 'qrcode';

@Component({
  standalone: false,
  selector: 'app-purchase-modal',
  templateUrl: './purchase-modal.component.html',
  styleUrls: ['./purchase-modal.component.css']
})
export class PurchaseModalComponent implements OnInit, OnDestroy {
  @Input() ticket!: Ticket;
  remainingTime: number = 300; // 5 minutes in seconds
  private timerSubscription?: Subscription;
  qrCodeUrl: string = '';
  showQrCode: boolean = false;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {
    // Timer será iniciado apenas após gerar o QR Code
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  startTimer() {
    this.timerSubscription = interval(1000)
      .pipe(take(this.remainingTime))
      .subscribe({
        next: () => {
          this.remainingTime--;
        },
        complete: () => {
          this.activeModal.dismiss('timeout');
        }
      });
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  async generateQrCode() {
    const ticketData = {
      id: this.ticket.id,
      eventName: this.ticket.eventName,
      date: this.ticket.eventDate,
      price: this.ticket.price
    };
    
    try {
      this.qrCodeUrl = await QRCode.toDataURL(JSON.stringify(ticketData));
      this.showQrCode = true;
      this.startTimer(); // Inicia o timer apenas após gerar o QR Code
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  }
}
