import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Ticket } from "../../models/ticket.model";
import { interval, Subscription } from "rxjs";
import { take } from "rxjs/operators";
import { CommonModule } from "@angular/common";
import * as QRCode from "qrcode";
import { SaleService } from "../../services/sale.service";

@Component({
  standalone: false,
  selector: "app-purchase-modal",
  templateUrl: "./purchase-modal.component.html",
  styleUrls: ["./purchase-modal.component.css"],
})
export class PurchaseModalComponent implements OnInit, OnDestroy {
  @Input() ticket!: Ticket;
  remainingTime: number = 300; // 5 minutes in seconds
  private timerSubscription?: Subscription;
  qrCodeUrl: string = "";
  showQrCode: boolean = false;

  contactInfo = {
    email: "",
    phone: "",
  };

  constructor(
    public activeModal: NgbActiveModal,
    private saleService: SaleService
  ) {}

  formatPhone(event: any) {
    let value = event.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
      value = value.replace(/(\d)(\d{4})$/, "$1-$2");
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
          this.activeModal.dismiss("timeout");
        },
      });
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  isFormValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\(?([0-9]{2})\)?[-. ]?([0-9]{4,5})[-. ]?([0-9]{4})$/;

    return (
      emailRegex.test(this.contactInfo.email) &&
      phoneRegex.test(this.contactInfo.phone)
    );
  }

  currentSaleId?: number;
  paymentStatus: 'pending' | 'approved' | 'failed' = 'pending';
  private statusCheckInterval?: any;

  generateQrCode() {
    const saleData = {
      ticketId: this.ticket.id,
      buyerEmail: this.contactInfo.email,
      buyerPhone: this.contactInfo.phone,
      amount: this.ticket.price,
    };

    this.saleService.createSale(saleData).subscribe({
      next: async (sale) => {
        this.currentSaleId = sale.id;
        const ticketData = {
          saleId: sale.id,
          ticketId: this.ticket.id,
          eventName: this.ticket.eventName,
          date: this.ticket.eventDate,
          price: this.ticket.price,
          contactInfo: this.contactInfo,
        };

        this.qrCodeUrl = await QRCode.toDataURL(JSON.stringify(ticketData));
        this.showQrCode = true;
        this.startTimer();
        this.startPaymentStatusCheck();
      },
      error: (error) => {
        console.error('Error creating sale:', error);
        // Handle error appropriately
      }
    });
  }

  private startPaymentStatusCheck() {
    if (!this.currentSaleId) return;

    this.statusCheckInterval = setInterval(() => {
      this.saleService.getSaleStatus(this.currentSaleId!).subscribe({
        next: (response) => {
          if (response.status === 'approved') {
            this.paymentStatus = 'approved';
            this.stopPaymentStatusCheck();
            // Optionally show success message or redirect
          } else if (response.status === 'failed') {
            this.paymentStatus = 'failed';
            this.stopPaymentStatusCheck();
          }
        },
        error: (error) => {
          console.error('Error checking payment status:', error);
          this.stopPaymentStatusCheck();
        }
      });
    }, 3000); // Check every 3 seconds
  }

  private stopPaymentStatusCheck() {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
      this.statusCheckInterval = undefined;
    }
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.stopPaymentStatusCheck();
  }
}
