import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketService } from '../../services/ticket.service';

@Component({
  standalone: false,
  selector: 'app-ticket-create',
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.css']
})
export class TicketCreateComponent implements OnInit {
  ticketForm: FormGroup;
  loading = false;
  error = false;
  success = false;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private ticketService: TicketService
  ) {
    this.ticketForm = this.fb.group({
      eventName: ['', Validators.required],
      imageUrl: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      location: ['', Validators.required],
      venue: ['', Validators.required],
      eventDate: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.ticketForm.valid) {
      console.log('Form submitted:', this.ticketForm.value);
      // Will be implemented later with backend integration
      this.activeModal.close(this.ticketForm.value);
    }
  }
}