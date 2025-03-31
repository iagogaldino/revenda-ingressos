
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
  selectedFile: File | null = null;
  previewUrl: string | null = null;

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
      quantity: ['', [Validators.required, Validators.min(1)]],
      file: [null]
    });
  }

  ngOnInit() {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Create preview URL for image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrl = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  }

  onSubmit() {
    if (this.ticketForm.valid) {
      const ticketData = this.ticketForm.value;
      ticketData.status = this.selectedFile ? 'active' : 'pending';
      
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        // Add ticket data to formData
        Object.keys(ticketData).forEach(key => {
          formData.append(key, ticketData[key]);
        });
      }

      console.log('Form submitted:', ticketData);
      this.activeModal.close({...ticketData, file: this.selectedFile});
    }
  }
}
