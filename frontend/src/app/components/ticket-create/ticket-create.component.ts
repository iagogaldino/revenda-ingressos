import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  standalone: false,
  selector: 'app-ticket-create',
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.css']
})
export class TicketCreateComponent implements OnInit {
  ticketForm!: FormGroup;
  selectedFile: File | null = null;
  selectedImage: File | null = null;
  imagePreviewUrl: string | null = null;
  previewUrl: string | null = null;
  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    public activeModal: NgbActiveModal
  ) {}

  loadCategories() {
    this.ticketService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.ticketForm = this.fb.group({
      eventName: ['Show do Gustavo Lima', Validators.required],
      description: ['Grande show de Gustavo Lima no São João de Petrolina.', Validators.required],
      category: ['', Validators.required],
      location: ['Petrolina, PE', Validators.required],
      venue: ['Pátio Ana das Carrancas', Validators.required],
      eventDate: ['2025-06-21T20:00:00', Validators.required],
      price: [250, [Validators.required, Validators.min(0)]],
      quantity: [500, [Validators.required, Validators.min(1)]]
    });

  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreviewUrl = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.ticketForm.invalid) {
      return;
    }

    const formData = new FormData();
    const ticketData = this.ticketForm.value;

    // Adicionar dados do formulário ao FormData
    Object.keys(ticketData).forEach(key => {
      formData.append(key, ticketData[key]);
    });

    // Adicionar arquivos ao FormData
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.ticketService.createTicket(formData).subscribe(
      response => {
        console.log('Ticket criado com sucesso:', response);
        this.activeModal.close();
      },
      error => {
        console.error('Erro ao criar ticket:', error);
      }
    );
  }
}
