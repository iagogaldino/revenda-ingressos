
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../types/ticket';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketCreateComponent } from '../ticket-create/ticket-create.component';

@Component({
  standalone: false,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userTickets: Ticket[] = [];
  loading = true;
  error: string | null = null;
  currentUser = {
    name: '',
    email: ''
  }

  constructor(
    private authService: AuthService,
    private ticketService: TicketService,
    private router: Router,
    private modalService: NgbModal
  ) {}

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

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser.name = user?.name || 'Error';
      this.currentUser.email = user?.email || 'Error';
    });
  }

  // loadUserTickets() {
  //   this.loading = true;
  //   this.ticketService.getUserTickets().subscribe({
  //     next: (tickets) => {
  //       this.userTickets = tickets;
  //       this.loading = false;
  //     },
  //     error: (error) => {
  //       this.error = 'Erro ao carregar ingressos';
  //       this.loading = false;
  //     }
  //   });
  // }

  navigateToPurchases() {
    this.router.navigate(['/tickets/purchases'])
      .catch(error => {
        console.error('Navigation error:', error);
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
