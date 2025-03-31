import { Component, OnInit } from "@angular/core";
import { TicketService } from "../../services/ticket.service";
import { Ticket } from "../../models/ticket.model";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TicketCreateComponent } from "../ticket-create/ticket-create.component";

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

  openTicketCreateModal() {
      console.log('openTicketCreateModal');
      const modalRef = this.modalService.open(TicketCreateComponent, {
        size: 'lg',
        centered: true
      });
  
      modalRef.result.then(
        (result) => {
          if (result) {
            console.log('New ticket data:', result);
            // Will be implemented later with backend integration
          }
        },
        (reason) => {
          console.log('Modal dismissed');
        }
      );
    }
  
}
