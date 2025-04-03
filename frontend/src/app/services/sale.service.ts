import { SaleDataResponse } from './../../../../backend/src/interfaces/sale.interface';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrl = `${environment.apiUrl}/sales`;

  constructor(private http: HttpClient) {}

  createSale(saleData: any): Observable<SaleDataResponse> {
    return this.http.post<SaleDataResponse>(this.apiUrl, saleData);
  }

  getSaleStatus(saleId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${saleId}/status`);
  }
}
