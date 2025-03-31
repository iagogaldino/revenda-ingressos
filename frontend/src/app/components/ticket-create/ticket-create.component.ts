import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-ticket-create',
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.css']
})
export class TicketCreateComponent implements OnInit {
  ticketForm: FormGroup;
  loading = false;
  error = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private router: Router
  ) {
    this.ticketForm = this.fb.group({
      eventName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      eventDate: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      category: ['', [Validators.required]],
      location: ['', [Validators.required]],
      imageUrl: ['']
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.ticketForm.valid) {
      this.loading = true;
      this.error = '';
      
      this.ticketService.createTicket(this.ticketForm.value).subscribe({
        next: () => {
          this.success = true;
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/gerenciar-ingressos']);
          }, 2000);
        },
        error: (error) => {
          this.error = 'Erro ao criar ingresso. Tente novamente.';
          this.loading = false;
          console.error('Error:', error);
        }
      });
    }
  }
}
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-create',
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.css']
})
export class TicketCreateComponent {
  ticketForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private ticketService: TicketService
  ) {
    this.ticketForm = this.fb.group({
      eventName: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      location: ['', Validators.required],
      venue: ['', Validators.required],
      eventDate: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit() {
    if (this.ticketForm.valid) {
      console.log('Form submitted:', this.ticketForm.value);
      // Will be implemented later with backend integration
      this.activeModal.close(this.ticketForm.value);
    }
  }
}
