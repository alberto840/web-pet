import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OfertaServicioModel } from '../models/producto.model';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class OfertaServicioService {
  private baseUrl = environment.apiUrl+'api/offers-services';

  constructor(private http: HttpClient) {}

  getAllOfertaServicio(): Observable<ResponseModel<OfertaServicioModel[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<OfertaServicioModel[]>>(`${this.baseUrl}`, { headers });
  }
  
  addOfertaServicio(ofertaServicio: OfertaServicioModel): Observable<ResponseModel<OfertaServicioModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ResponseModel<OfertaServicioModel>>(`${this.baseUrl}`, ofertaServicio, { headers });
  }

  updateOfertaServicio(ofertaServicio: OfertaServicioModel): Observable<ResponseModel<OfertaServicioModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<ResponseModel<OfertaServicioModel>>(`${this.baseUrl}/${ofertaServicio.offerId}`, ofertaServicio, { headers });
  }

  deleteOfertaServicio(ofertaServicioId: number): Observable<ResponseModel<OfertaServicioModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseModel<OfertaServicioModel>>(`${this.baseUrl}/${ofertaServicioId}`, { headers });
  }
}
