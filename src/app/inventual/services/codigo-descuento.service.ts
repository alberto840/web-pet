import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CodigoDescuentoModel } from '../models/producto.model';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class CodigoDescuentoService {
  private baseUrl = environment.apiUrl+'api/promo-codes';

  constructor(private http: HttpClient) {}

  getAllCodigosDescuento(): Observable<ResponseModel<CodigoDescuentoModel[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<CodigoDescuentoModel[]>>(`${this.baseUrl}`, { headers });
  }

  addCodigoDescuento(codigoDescuento: CodigoDescuentoModel): Observable<ResponseModel<CodigoDescuentoModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ResponseModel<CodigoDescuentoModel>>(`${this.baseUrl}`, codigoDescuento, { headers });
  }

  updateCodigoDescuento(codigoDescuento: CodigoDescuentoModel): Observable<ResponseModel<CodigoDescuentoModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<ResponseModel<CodigoDescuentoModel>>(`${this.baseUrl}/${codigoDescuento.promoId}`, codigoDescuento, { headers });
  }

  deleteCodigoDescuento(codigoDescuentoId: number): Observable<ResponseModel<CodigoDescuentoModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseModel<CodigoDescuentoModel>>(`${this.baseUrl}/${codigoDescuentoId}`, { headers });
  }
}
