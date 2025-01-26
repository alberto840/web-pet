import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OfertaProductoModel } from '../models/producto.model';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class OfertaProductoService {
  private baseUrl = environment.apiUrl+'api/offers-products';

  constructor(private http: HttpClient) {}

  getAllOfertaProductos(): Observable<ResponseModel<OfertaProductoModel[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<OfertaProductoModel[]>>(`${this.baseUrl}`, { headers });
  }

  addOfertaProducto(ofertaProducto: OfertaProductoModel): Observable<ResponseModel<OfertaProductoModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ResponseModel<OfertaProductoModel>>(`${this.baseUrl}`, ofertaProducto, { headers });
  }

  updateOfertaProducto(ofertaProducto: OfertaProductoModel): Observable<ResponseModel<OfertaProductoModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<ResponseModel<OfertaProductoModel>>(`${this.baseUrl}/${ofertaProducto.offerId}`, ofertaProducto, { headers });
  }

  deleteOfertaProducto(ofertaProductoId: number): Observable<ResponseModel<OfertaProductoModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseModel<OfertaProductoModel>>(`${this.baseUrl}/${ofertaProductoId}`, { headers });
  }
}
