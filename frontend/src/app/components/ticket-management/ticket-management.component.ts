import { Component, OnInit } from "@angular/core";
import { TicketService } from "../../services/ticket.service";
import { Ticket } from "../../models/ticket.model";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TicketCreateComponent } from "../ticket-create/ticket-create.component";
import { environment } from "src/environments/environment";

@Component({
  standalone: false,
  selector: "app-ticket-management",
  templateUrl: "./ticket-management.component.html",
  styleUrls: ["./ticket-management.component.css"],
})
export class TicketManagementComponent implements OnInit {
  tickets: Ticket[] = [];
  loading = false;
  error = "";
  successMessage = "";

  constructor(
    private ticketService: TicketService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.loading = true;
    this.ticketService.getSellerTickets().subscribe({
      next: (tickets) => {
        console.log("Tickets:", tickets);
        this.tickets = tickets;
        this.loading = false;
      },
      error: (error) => {
        this.error = "Erro ao carregar ingressos";
        this.loading = false;
        console.error("Error:", error);
      },
    });
  }

  onDelete(ticketId: number) {
    if (confirm("Tem certeza que deseja excluir este ingresso?")) {
      this.ticketService.deleteTicket(ticketId).subscribe({
        next: () => {
          this.successMessage = "Ingresso excluído com sucesso!";
          this.loadTickets();
          setTimeout(() => (this.successMessage = ""), 3000);
        },
        error: (error) => {
          this.error = "Erro ao excluir ingresso";
          console.error("Error:", error);
        },
      });
    }
  }

  onToggleStatus(ticket: Ticket) {
    const newStatus = ticket.active ? false : true;
    this.ticketService.updateTicketStatus(ticket.id, newStatus).subscribe({
      next: () => {
        ticket.active = newStatus;
        this.successMessage = `Ingresso ${
          newStatus ? "ativado" : "desativado"
        } com sucesso!`;
        setTimeout(() => (this.successMessage = ""), 3000);
      },
      error: (error) => {
        this.error = "Erro ao atualizar status do ingresso";
        console.error("Error:", error);
      },
    });
  }

  openTicketModal(ticket?: Ticket) {
    const modalRef = this.modalService.open(TicketCreateComponent, {
      size: 'lg',
      centered: true
    });

    if (ticket) {
      modalRef.componentInstance.editMode = true;
      modalRef.componentInstance.ticketData = {...ticket};
      modalRef.componentInstance.imagePreviewUrl = ticket.image;
      modalRef.componentInstance.previewUrl = ticket.file;
    }

    modalRef.result.then(
      (result) => {
        if (result) {
          const formData = new FormData();
          if (result.file) {
            formData.append('file', result.file);
          }
          if (result.image) {
            formData.append('image', result.image);
          }
          
          Object.keys(result).forEach(key => {
            if (key !== 'file' && key !== 'image') {
              formData.append(key, result[key]?.toString());
            }
          });

        }
        this.loadTickets();
      },
      (reason) => {
        console.log('Modal dismissed');
      }
    );
  }
  
}
