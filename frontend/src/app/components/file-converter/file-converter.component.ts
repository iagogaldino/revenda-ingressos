
import { Component } from '@angular/core';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-file-converter',
  templateUrl: './file-converter.component.html',
  styleUrls: ['./file-converter.component.css']
})
export class FileConverterComponent {
  dragActive = false;
  converting = false;
  markdown = '';
  error: string | null = null;

  constructor(private ticketService: TicketService) {}

  handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.convertFile(files[0]);
    }
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive = true;
  }

  handleDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive = false;
  }

  handleFileInput(event: Event) {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (files && files.length > 0) {
      this.convertFile(files[0]);
    }
  }

  private convertFile(file: File) {
    this.converting = true;
    this.error = null;
    this.markdown = '';
    
    this.ticketService.convertFile(file).subscribe({
      next: (markdown) => {
        this.markdown = markdown;
        this.converting = false;
      },
      error: (error) => {
        this.error = 'Error converting file. Please try again.';
        this.converting = false;
      }
    });
  }
}
