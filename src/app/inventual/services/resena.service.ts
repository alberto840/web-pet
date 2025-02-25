import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResenaModel } from '../models/proveedor.model';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class ResenaService {
  private baseUrl = environment.apiUrl+'api/reviews';

  constructor(private http: HttpClient) {}

  getAllResenas(): Observable<ResponseModel<ResenaModel[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<ResenaModel[]>>(`${this.baseUrl}`, { headers });
  }
  
  addResena(resena: ResenaModel): Observable<ResponseModel<ResenaModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ResponseModel<ResenaModel>>(`${this.baseUrl}`, resena, { headers });
  }

  updateResena(resena: ResenaModel): Observable<ResponseModel<ResenaModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<ResponseModel<ResenaModel>>(`${this.baseUrl}/${resena.reviewsId}`, resena, { headers });
  }

  deleteResena(resenaId: number): Observable<ResponseModel<ResenaModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseModel<ResenaModel>>(`${this.baseUrl}/${resenaId}`, { headers });
  }

  getResenaById(providerId: number): Observable<ResponseModel<ResenaModel[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<ResenaModel[]>>(`${this.baseUrl}/provider/${providerId}`, { headers });
  }
}
