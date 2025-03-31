
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TicketService } from '../../services/ticket.service';
import { User } from '../../types/user';
import { Ticket } from '../../types/ticket';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  userTickets: Ticket[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private ticketService: TicketService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadUserTickets();
      }
    });
  }

  loadUserTickets() {
    this.loading = true;
    this.ticketService.getUserTickets().subscribe({
      next: (tickets) => {
        this.userTickets = tickets;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar ingressos';
        this.loading = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
