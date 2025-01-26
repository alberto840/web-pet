import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response.model';
import { TransaccionModel } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class TransaccionService {
  private baseUrl = environment.apiUrl+'api/transaction-history';

  constructor(private http: HttpClient) {}

  getAllTransaccions(): Observable<ResponseModel<TransaccionModel[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<TransaccionModel[]>>(`${this.baseUrl}`, { headers });
  }

  addTransaccion(transaccion: TransaccionModel): Observable<ResponseModel<TransaccionModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ResponseModel<TransaccionModel>>(`${this.baseUrl}`, transaccion, { headers });
  }

  updateTransaccion(transaccion: TransaccionModel): Observable<ResponseModel<TransaccionModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<ResponseModel<TransaccionModel>>(`${this.baseUrl}/${transaccion.transactionHistoryId}`, transaccion, { headers });
  }

  deleteTransaccion(transaccionId: number): Observable<ResponseModel<TransaccionModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseModel<TransaccionModel>>(`${this.baseUrl}/${transaccionId}`, { headers });
  }
}
