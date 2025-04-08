
import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Ticket } from "../../models/ticket.model";
import { interval, Subscription } from "rxjs";
import { take } from "rxjs/operators";
import * as QRCode from "qrcode";
import { SaleService } from "../../services/sale.service";
import { HttpClient, HttpResponse } from '@angular/common/http';
import { TicketService } from "src/app/services/ticket.service";

@Component({
  standalone: false,
  selector: "app-purchase-modal",
  templateUrl: "./purchase-modal.component.html",
  styleUrls: ["./purchase-modal.component.css"],
})
export class PurchaseModalComponent implements OnInit, OnDestroy {
  @Input() ticket!: Ticket;
  currentStep: number = 1;
  remainingTime: number = 300;
  private timerSubscription?: Subscription;
  qrCode: string = "";
  qrCodeUrl: string = "";
  showQrCode: boolean = false;
  copySuccess: boolean = false;
  qrCodeError: boolean = false;

  contactInfo = {
    name: "",
    email: "",
    phone: "",
  };

  currentSaleId?: number;
  ticketDownload: string = '';
  tokenDownload: string = '';
  paymentStatus: 'pending' | 'approved' | 'failed' = 'pending';
  private statusCheckInterval?: any;

  constructor(
    public activeModal: NgbActiveModal,
    private saleService: SaleService,
    private ticketService: TicketService,
    private http: HttpClient
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.stopTimer();
    this.stopPaymentStatusCheck();
  }

  formatPhone(event: any) {
    let value = event.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
      value = value.replace(/(\d)(\d{4})$/, "$1-$2");
      this.contactInfo.phone = value;
    }
  }

  nextStep() {
    if (this.currentStep === 1 && this.isFormValid()) {
      this.currentStep = 2;
    } else if (this.currentStep === 2) {
      this.currentStep = 3;
      this.generateQrCode();
    }
  }

  async generateQrCode() {
    this.qrCodeError = false;
    this.showQrCode = false;
    const saleData = {
      ticketId: this.ticket.id,
      buyerName: this.contactInfo.name,
      buyerEmail: this.contactInfo.email,
      buyerPhone: this.contactInfo.phone,
      amount: this.ticket.price,
    };

    this.saleService.createSale(saleData).subscribe({
      next: async (response) => {
        try {
          this.currentSaleId = response.sale.id;
          this.qrCode = response.sale.qrCode;
          this.qrCodeUrl = await QRCode.toDataURL(this.qrCode);
          this.showQrCode = true;
          this.startTimer();
          this.startPaymentStatusCheck();
        } catch (error) {
          console.error('Error generating QR code:', error);
          this.qrCodeError = true;
          this.stopTimer();
        }
      },
      error: (error) => {
        console.error('Error creating sale:', error);
        this.paymentStatus = 'failed';
        this.qrCodeError = true;
        this.stopTimer();
      }
    });
  }

  retryQrCodeGeneration() {
    this.generateQrCode();
  }

  startTimer() {
    this.stopTimer();
    this.remainingTime = 300;
    this.timerSubscription = interval(1000)
      .pipe(take(this.remainingTime))
      .subscribe({
        next: () => {
          this.remainingTime--;
        },
        complete: () => {
          this.paymentStatus = 'failed';
          this.activeModal.dismiss("timeout");
        },
      });
  }

  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
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
      this.contactInfo.name.trim().length > 0 &&
      emailRegex.test(this.contactInfo.email) &&
      phoneRegex.test(this.contactInfo.phone)
    );
  }

  private startPaymentStatusCheck() {
    if (!this.currentSaleId) return;

    this.statusCheckInterval = setInterval(() => {
      this.saleService.getSaleStatus(this.currentSaleId!).subscribe({
        next: (response) => {
          if (response.status === 'approved') {
            this.paymentStatus = 'approved';
            this.ticketDownload = response.ticket || '';
            this.tokenDownload = response.token || '';
            this.stopPaymentStatusCheck();
            this.currentStep = 4;
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
    }, 3000);
  }

  private stopPaymentStatusCheck() {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
      this.statusCheckInterval = undefined;
    }
  }

  async copyQRCode() {
    try {
      await navigator.clipboard.writeText(this.qrCode);
      this.copySuccess = true;
      setTimeout(() => {
        this.copySuccess = false;
      }, 3000);
    } catch (err) {
      console.error('Failed to copy QR Code:', err);
    }
  }

  downloadTicket() {
    if (this.paymentStatus === 'approved' && this.currentSaleId) {
      this.ticketService.downloadTicket(this.currentSaleId, this.tokenDownload).subscribe({
        next: (response: HttpResponse<Blob>) => {
          const blob = new Blob([response.body as Blob], { type: response.body?.type });
          const url = window.URL.createObjectURL(blob);
          const contentDisposition = response.headers.get('Content-Disposition');
          let fileName = 'ticket';

          if (contentDisposition && contentDisposition.includes('filename=')) {
            fileName = contentDisposition.split('filename=')[1].trim().replace(/"/g, '');
          } else {
            fileName = `ingresso.${this.ticketDownload.split(".")[1]}`;
          }

          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error("Error downloading ticket:", error);
        }
      });
    }
  }

  retryPayment() {
    this.paymentStatus = 'pending';
    this.currentStep = 2;
    this.generateQrCode();
  }

  finishPurchase() {
    this.activeModal.close('success');
  }
}
