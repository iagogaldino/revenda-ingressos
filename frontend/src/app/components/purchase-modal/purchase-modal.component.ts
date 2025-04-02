
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
  
  contactInfo = {
    email: '',
    phone: ''
  };

  constructor(public activeModal: NgbActiveModal) {}

  formatPhone(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
      value = value.replace(/(\d)(\d{4})$/, '$1-$2');
      this.contactInfo.phone = value;
    }
  }

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

  isFormValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\(?([0-9]{2})\)?[-. ]?([0-9]{4,5})[-. ]?([0-9]{4})$/;
    
    return emailRegex.test(this.contactInfo.email) && 
           phoneRegex.test(this.contactInfo.phone);
  }

  async generateQrCode() {
    const ticketData = {
      id: this.ticket.id,
      eventName: this.ticket.eventName,
      date: this.ticket.eventDate,
      price: this.ticket.price,
      contactInfo: this.contactInfo
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
