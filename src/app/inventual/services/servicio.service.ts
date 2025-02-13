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

  addServicio(servicio: ServicioModel, file: File): Observable<ResponseModel<ServicioModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const formData = new FormData();
    formData.append('service', JSON.stringify(servicio)); // Servicio como JSON
    formData.append('file', file);
  
    return this.http.post<ResponseModel<ServicioModel>>(
      `${this.baseUrl}`,
      formData,
      { headers }
    );
  }

  updateServicio(servicio: ServicioModel, file: File): Observable<ResponseModel<ServicioModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const formData = new FormData();
    formData.append('service', JSON.stringify(servicio)); // Servicio como JSON
    formData.append('file', file);
  
    return this.http.put<ResponseModel<ServicioModel>>(
      `${this.baseUrl}/${servicio.serviceId}`, // Asumiendo que el ID del servicio es `serviceId`
      formData,
      { headers }
    );
  }
  
  deleteServicio(servicioId: number): Observable<ResponseModel<ServicioModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseModel<ServicioModel>>(`${this.baseUrl}/${servicioId}`, { headers });
  }

  getServicioById(servicioId: number): Observable<ResponseModel<ServicioModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<ServicioModel>>(`${this.baseUrl}/${servicioId}`, { headers });
  }

  getServiciosByProviderId(providerId: number): Observable<ResponseModel<ServicioModel[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<ServicioModel[]>>(`${this.baseUrl}/by-provider/${providerId}`, { headers });
  }
}
