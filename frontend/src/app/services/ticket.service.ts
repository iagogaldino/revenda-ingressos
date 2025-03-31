import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Ticket } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://0.0.0.0:5000/api';
  private categoriesUrl = `${this.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/tickets`)
      .pipe(
        catchError(this.handleError('getAllTickets', []))
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

    queryParams = queryParams ? queryParams.slice(0, -1) : queryParams;
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