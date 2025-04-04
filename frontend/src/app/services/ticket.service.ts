import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Ticket } from "../types/ticket";
import { getToken } from "../utils/token-util";
import { Category } from "../models/category.interface";

@Injectable({
  providedIn: "root",
})
export class TicketService {
  private apiUrl = "http://localhost:5000/api";
  private categoriesUrl = `${this.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<any>(`${this.apiUrl}/tickets`).pipe(
      map((response) => {
        if (!response || !response.data) {
          return [];
        }
        return response.data.map((ticket: Ticket) => ({
          ...ticket,
          image: ticket.image ? `${environment.imageBaseUrl}/${ticket.image}` : 'assets/placeholder-event.jpg'
        }));
      }),
      catchError(this.handleError("getAllTickets", []))
    );
  }

  getTicketById(id: number): Observable<Ticket | null> {
    return this.http
      .get<Ticket | null>(`${this.apiUrl}/tickets/${id}`)
      .pipe(catchError(this.handleError("getTicketById", null)));
  }

  getCategories(): Observable<Category[]> {
    return this.http
      .get<string[]>(this.categoriesUrl)
      .pipe(
        map((response: any) => response.data),
        catchError(this.handleError("getCategories", [])));
  }

  filterTickets(
    category?: string,
    minPrice?: number,
    maxPrice?: number
  ): Observable<Ticket[]> {
    let queryParams = "";

    if (category) {
      queryParams += `category=${category}`;
    }
    if (minPrice !== undefined) {
      queryParams += queryParams
        ? `&minPrice=${minPrice}`
        : `minPrice=${minPrice}`;
    }
    if (maxPrice !== undefined) {
      queryParams += queryParams
        ? `&maxPrice=${maxPrice}`
        : `maxPrice=${maxPrice}`;
    }

    const url = queryParams
      ? `${this.apiUrl}/tickets?${queryParams}`
      : `${this.apiUrl}/tickets`;

    return this.http
      .get<Ticket[]>(url)
      .pipe(catchError(this.handleError("filterTickets", [])));
  }

  createTicket(formData: FormData): Observable<Ticket | null> {
    return this.http
      .post<Ticket>(`${this.apiUrl}/seller/tickets`, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .pipe(
        map((response) => {
          if (!response) {
            throw new Error("No ticket data received");
          }
          return response;
        }),
        catchError(this.handleError("createTicket", null))
      );
  }

  getSellerTickets(): Observable<Ticket[]> {
    return this.http
      .get<Ticket[]>(`${this.apiUrl}/seller/tickets`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .pipe(
        map((response: any) => {
          if (!response || !response.data) {
            return [];
          }
          console.log("Tickets:", response);
          return response.data.map((ticket: Ticket) => ({
            ...this.transformTicketData(ticket),
            image: ticket.image ? `${environment.imageBaseUrl}/${ticket.image}` : 'assets/placeholder-event.jpg',
            file: ticket.file ? `${environment.imageBaseUrl}/${ticket.file}` : 'assets/placeholder-event.jpg'
          }));
        }),
        catchError(this.handleError("getSellerTickets", []))
      );
  }

  updateTicketStatus(ticketId: number, active: boolean): Observable<any> {
    return this.http
      .patch(`${this.apiUrl}/tickets/${ticketId}/status`, { active })
      .pipe(catchError(this.handleError("updateTicketStatus")));
  }

  deleteTicket(ticketId: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/tickets/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .pipe(catchError(this.handleError("deleteTicket")));
  }

  updateTicket(
    ticketId: number,
    formData: FormData
  ): Observable<Ticket | null> {
    return this.http
      .put<Ticket>(`${this.apiUrl}/seller/tickets/${ticketId}`, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .pipe(catchError(this.handleError("updateTicket", null)));
  }

  downloadTicket(saleId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/tickets/download/sale/${saleId}`, {
      responseType: 'blob'
    });
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      console.error("Error details:", error);
      return of(result as T);
    };
  }

  convertFile(file: File): Observable<string> {
    const formData = new FormData();
    formData.append("file", file);

    return this.http
      .post<{ markdown: string }>(`${this.apiUrl}/convert`, formData)
      .pipe(
        map((response) => response.markdown),
        catchError(this.handleError("convertFile", ""))
      );
  }


  private transformTicketData(ticket: any): Partial< Ticket > {
    return {
      id: ticket.id,
      eventName: ticket.event_name,
      eventDate: this.formatDate(ticket.event_date),
      location: ticket.location,
      venue: ticket.venue,
      price: parseFloat(ticket.price),
      originalPrice: ticket.original_price ? parseFloat(ticket.original_price) : null,
      description: ticket.description,
      category: ticket.category,
      image: ticket.image,
      file: ticket.file,
      active: ticket.active,
      quantity: ticket.quantity,
      paymentStatus: ticket.paymentStatus || ticket.payment_status,
      status: ticket.status,
      sold: ticket.sold
    };
  }

  private formatDate(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
}
