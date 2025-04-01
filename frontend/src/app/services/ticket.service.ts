
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Ticket } from '../types/ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://localhost:5000/api';
  private categoriesUrl = `${this.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/tickets`)
      .pipe(
        catchError(this.handleError('getAllTickets', []))
      );
  }

  getTicketById(id: number): Observable<Ticket | null> {
    return this.http.get<Ticket | null>(`${this.apiUrl}/tickets/${id}`)
      .pipe(
        catchError(this.handleError('getTicketById', null))
      );
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(this.categoriesUrl)
      .pipe(
        catchError(this.handleError('getCategories', []))
      );
  }

  filterTickets(category?: string, minPrice?: number, maxPrice?: number): Observable<Ticket[]> {
    let queryParams = '';

    if (category) {
      queryParams += `category=${category}`;
    }
    if (minPrice !== undefined) {
      queryParams += queryParams ? `&minPrice=${minPrice}` : `minPrice=${minPrice}`;
    }
    if (maxPrice !== undefined) {
      queryParams += queryParams ? `&maxPrice=${maxPrice}` : `maxPrice=${maxPrice}`;
    }

    const url = queryParams ? `${this.apiUrl}/tickets?${queryParams}` : `${this.apiUrl}/tickets`;

    return this.http.get<Ticket[]>(url)
      .pipe(
        catchError(this.handleError('filterTickets', []))
      );
  }

  createTicket(formData: FormData): Observable<Ticket | null> {
    return this.http.post<Ticket>(`${this.apiUrl}/seller/tickets`, formData).pipe(
      map(response => {
        if (!response) {
          throw new Error('No ticket data received');
        }
        return response;
      }),
      catchError(this.handleError('createTicket', null))
    );
  }

  getSellerTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/seller/tickets`)
      .pipe(
        catchError(this.handleError('getSellerTickets', []))
      );
  }

  updateTicketStatus(ticketId: number, active: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/tickets/${ticketId}/status`, { active })
      .pipe(
        catchError(this.handleError('updateTicketStatus'))
      );
  }

  deleteTicket(ticketId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tickets/${ticketId}`)
      .pipe(
        catchError(this.handleError('deleteTicket'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      console.error('Error details:', error);
      return of(result as T);
    };
  }

  convertFile(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<{markdown: string}>(`${this.apiUrl}/convert`, formData)
      .pipe(
        map(response => response.markdown),
        catchError(this.handleError('convertFile', ''))
      );
  }
}
