import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EspecialidadModel } from '../models/especialidad.model';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {
  private baseUrl = environment.apiUrl+'api/specialties';

  constructor(private http: HttpClient) {}

  getAllEspecialidades(): Observable<ResponseModel<EspecialidadModel[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<EspecialidadModel[]>>(`${this.baseUrl}`, { headers });
  }

  addEspecialidad(especialidad: EspecialidadModel): Observable<ResponseModel<EspecialidadModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ResponseModel<EspecialidadModel>>(`${this.baseUrl}`, especialidad, { headers });
  }

  updateEspecialidad(especialidad: EspecialidadModel): Observable<ResponseModel<EspecialidadModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<ResponseModel<EspecialidadModel>>(`${this.baseUrl}/${especialidad.specialtyId}`, especialidad, { headers });
  }

  deleteEspecialidad(especialidadId: number): Observable<ResponseModel<EspecialidadModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseModel<EspecialidadModel>>(`${this.baseUrl}/${especialidadId}`, { headers });
  }
}
