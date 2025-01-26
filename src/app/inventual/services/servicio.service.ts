import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ServicioModel } from '../models/producto.model';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private baseUrl = environment.apiUrl+'api/services';

  constructor(private http: HttpClient) {}

  getAllServicios(): Observable<ResponseModel<ServicioModel[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<ServicioModel[]>>(`${this.baseUrl}`, { headers });
  }
  
  addServicio(servicio: ServicioModel): Observable<ResponseModel<ServicioModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ResponseModel<ServicioModel>>(`${this.baseUrl}`, servicio, { headers });
  }

  updateServicio(servicio: ServicioModel): Observable<ResponseModel<ServicioModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<ResponseModel<ServicioModel>>(`${this.baseUrl}/${servicio.serviceId}`, servicio, { headers });
  }

  deleteServicio(servicioId: number): Observable<ResponseModel<ServicioModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseModel<ServicioModel>>(`${this.baseUrl}/${servicioId}`, { headers });
  }
}
