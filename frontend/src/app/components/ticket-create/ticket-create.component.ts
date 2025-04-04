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

  editMode = false;
  ticketData: any;

  ngOnInit(): void {
    this.loadCategories();
    this.initForm();
  }

  private initForm(): void {
    console.log('Initializing form...', this.ticketData);
    this.ticketForm = this.fb.group({
      id: [this.editMode && this.ticketData?.id ? this.ticketData.id : ''],
      eventName: [this.editMode && this.ticketData?.eventName ? this.ticketData.eventName : '', Validators.required],
      description: [this.editMode && this.ticketData?.description ? this.ticketData.description : '', Validators.required],
      category: [this.editMode && this.ticketData?.category ? this.ticketData.category : '', Validators.required],
      location: [this.editMode && this.ticketData?.location ? this.ticketData.location : '', Validators.required],
      venue: [this.editMode && this.ticketData?.venue ? this.ticketData.venue : '', Validators.required],
      eventDate: [this.editMode && this.ticketData?.eventDate ? this.formatDate(this.ticketData.eventDate) : '', Validators.required],
      price: [this.editMode && this.ticketData?.price ? this.ticketData.price : 0, [Validators.required, Validators.min(0)]],
      quantity: [this.editMode && this.ticketData?.quantity ? this.ticketData.quantity : 0, [Validators.required, Validators.min(1)]]
    });

    if (this.editMode && this.ticketData?.image) {
      this.imagePreviewUrl = this.ticketData.image;
    }
    console.log('Initializing form...', this.editMode, this.ticketForm.value);
}

private formatDate(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
      console.error('Formulário inválido:', this.ticketForm.errors);
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
    } else if (this.editMode && this.ticketData.file) {
      // Se estiver editando e o arquivo já existir, adicione-o como URL
      formData.append('existingFile', this.ticketData.file);
    }

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    } else if (this.editMode && this.ticketData.image) {
      // Se estiver editando e a imagem já existir, adicione-a como URL
      formData.append('existingImage', this.ticketData.image);
    }

    this.editMode ? this.updateTicket(this.ticketData.id, formData) : this.createTicket(formData);
}

  createTicket(formData: FormData): void {
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
  
  updateTicket(id: number, formData: FormData): void {
    this.ticketService.updateTicket(id, formData).subscribe(
      response => {
        console.log('Ticket editado com sucesso:', response);
        this.activeModal.close();
      },
      error => {
        console.error('Erro ao editar ticket:', error);
      }
    );
  }
}
