
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      console.error('Error details:', error);
      return of(result as T);
    };
  }
}
