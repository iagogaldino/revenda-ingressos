
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';

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
  selectedImage: File | null = null;
  imagePreviewUrl: string | null = null;
  editMode = false;
  ticketData: Ticket | null = null;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private ticketService: TicketService
  ) {
    // this.ticketForm = this.fb.group({
    //   eventName: ['', Validators.required],
    //   imageUrl: ['', Validators.required],
    //   description: ['', Validators.required],
    //   category: ['', Validators.required],
    //   location: ['', Validators.required],
    //   venue: ['', Validators.required],
    //   eventDate: ['', Validators.required],
    //   price: ['', [Validators.required, Validators.min(0)]],
    //   quantity: ['', [Validators.required, Validators.min(1)]],
    //   file: [null]
    // });

    const mockData = {
      eventName: ['Show do Gustavo Lima', Validators.required],
      imageUrl: ['https://example.com/imagens/gustavo-lima.jpg', Validators.required],
      description: ['Apresentação ao vivo de Gustavo Lima no São João de Petrolina.', Validators.required],
      category: ['Música', Validators.required],
      location: ['Petrolina, PE', Validators.required],
      venue: ['Pátio Ana das Carrancas', Validators.required],
      eventDate: ['2025-06-21', Validators.required],
      price: [200, [Validators.required, Validators.min(0)]],
      quantity: [500, [Validators.required, Validators.min(1)]],
      file: [null]
    };
    this.ticketForm = this.fb.group(mockData);

 
  }

  ngOnInit() {
    if (this.editMode && this.ticketData) {
      this.ticketForm.patchValue({
        eventName: this.ticketData.eventName,
        description: this.ticketData.description,
        category: this.ticketData.category,
        location: this.ticketData.location,
        venue: this.ticketData.venue,
        eventDate: this.ticketData.eventDate,
        price: this.ticketData.price,
        quantity: this.ticketData.quantity
      });
      this.previewUrl = this.ticketData.imageUrl;
    }
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedImage = null;
      this.imagePreviewUrl = null;
      alert('Por favor, selecione uma imagem válida (JPG, PNG)');
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      this.previewUrl = null; // Não exibimos preview para PDF
    } else {
      this.selectedFile = null;
      this.previewUrl = null;
      alert('Por favor, selecione um arquivo PDF válido');
    }
  }

  onSubmit() {
    if (this.ticketForm.valid) {
      if (!this.selectedImage) {
        alert('Por favor, selecione uma imagem para o ingresso');
        return;
      }
      if (!this.selectedFile) {
        alert('Por favor, selecione o arquivo PDF do ingresso');
        return;
      }

      const ticketData = this.ticketForm.value;
      ticketData.status = 'active';
      
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('image', this.selectedImage);
      
      Object.keys(ticketData).forEach(key => {
        if (ticketData[key] !== null && ticketData[key] !== undefined) {
          formData.append(key, ticketData[key].toString());
        }
      });

      this.loading = true;
      this.error = false;

      this.activeModal.close({
        id: this.editMode ? this.ticketData?.id : null,
        formData,
        ...ticketData,
        file: this.selectedFile,
        image: this.selectedImage
      });
    }
  }
}
