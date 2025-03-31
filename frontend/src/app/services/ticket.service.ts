import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Ticket } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://localhost:5000/api/tickets';
  private categoriesUrl = 'http://localhost:5000/api/categories';

  constructor(private http: HttpClient) { }

  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError<Ticket[]>('getAllTickets', []))
      );
  }

  getTicketById(id: number): Observable<Ticket | undefined> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError<Ticket>(`getTicketById id=${id}`))
      );
  }

  searchTickets(term: string): Observable<Ticket[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Ticket[]>(`${this.apiUrl}?search=${term}`)
      .pipe(
        catchError(this.handleError<Ticket[]>('searchTickets', []))
      );
  }

  filterTickets(category?: string, minPrice?: number, maxPrice?: number): Observable<Ticket[]> {
    let queryParams = '';

    if (category) {
      queryParams += `category=${category}&`;
    }

    if (minPrice !== undefined) {
      queryParams += `minPrice=${minPrice}&`;
    }

    if (maxPrice !== undefined) {
      queryParams += `maxPrice=${maxPrice}&`;
    }

    // Remove trailing '&' if it exists
    queryParams = queryParams.endsWith('&') 
      ? queryParams.slice(0, -1) 
      : queryParams;

    const url = queryParams 
      ? `${this.apiUrl}?${queryParams}` 
      : this.apiUrl;

    return this.http.get<Ticket[]>(url)
      .pipe(
        catchError(this.handleError<Ticket[]>('filterTickets', []))
      );
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(this.categoriesUrl)
      .pipe(
        catchError(this.handleError<string[]>('getCategories', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      console.error('Error details:', error);

      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }
}