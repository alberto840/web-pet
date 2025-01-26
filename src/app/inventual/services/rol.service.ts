import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response.model';
import { RolModel } from '../models/rol.model';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private baseUrl = environment.apiUrl+'api/roles';

  constructor(private http: HttpClient) {}

  getAllRoles(): Observable<ResponseModel<RolModel[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<RolModel[]>>(`${this.baseUrl}`, { headers });
  }

  addRol(rol: RolModel): Observable<ResponseModel<RolModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ResponseModel<RolModel>>(`${this.baseUrl}`, rol, { headers });
  }

  updateRol(rol: RolModel): Observable<ResponseModel<RolModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<ResponseModel<RolModel>>(`${this.baseUrl}/${rol}`, rol, { headers });
  }

  deleteRol(rolId: number): Observable<ResponseModel<RolModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseModel<RolModel>>(`${this.baseUrl}/${rolId}`, { headers });
  }
}
