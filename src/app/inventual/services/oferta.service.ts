import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OfertaModel } from '../models/producto.model';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class OfertaService {
  private baseUrl = environment.apiUrl+'api/offers';

  constructor(private http: HttpClient) {}

  getAllOfertas(): Observable<ResponseModel<OfertaModel[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<OfertaModel[]>>(`${this.baseUrl}`, { headers });
  }

  addOferta(oferta: OfertaModel): Observable<ResponseModel<OfertaModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ResponseModel<OfertaModel>>(`${this.baseUrl}`, oferta, { headers });
  }

  updateOferta(oferta: OfertaModel): Observable<ResponseModel<OfertaModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<ResponseModel<OfertaModel>>(`${this.baseUrl}/${oferta.offerId}`, oferta, { headers });
  }

  deleteOferta(ofertaId: number): Observable<ResponseModel<OfertaModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseModel<OfertaModel>>(`${this.baseUrl}/${ofertaId}`, { headers });
  }
}
