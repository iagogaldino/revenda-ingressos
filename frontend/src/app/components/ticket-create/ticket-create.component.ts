import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { Router } from '@angular/router';

@Component({
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