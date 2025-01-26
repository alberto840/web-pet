import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EspecialidadProveedorModel } from '../models/proveedor.model';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadProveedorService {
  private baseUrl = environment.apiUrl+'api/speciality-providers';

  constructor(private http: HttpClient) {}

  getAllEspecialidadesProveedores(): Observable<ResponseModel<EspecialidadProveedorModel[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<EspecialidadProveedorModel[]>>(`${this.baseUrl}`, { headers });
  }

  addEspecialidadProveedor(especialidadProveedor: EspecialidadProveedorModel): Observable<ResponseModel<EspecialidadProveedorModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ResponseModel<EspecialidadProveedorModel>>(`${this.baseUrl}`, especialidadProveedor, { headers });
  }

  updateEspecialidadProveedor(especialidadProveedor: EspecialidadProveedorModel): Observable<ResponseModel<EspecialidadProveedorModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<ResponseModel<EspecialidadProveedorModel>>(`${this.baseUrl}/${especialidadProveedor.idSpProvider}`, especialidadProveedor, { headers });
  }

  deleteEspecialidadProveedor(especialidadProveedorId: number): Observable<ResponseModel<EspecialidadProveedorModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseModel<EspecialidadProveedorModel>>(`${this.baseUrl}/${especialidadProveedorId}`, { headers });
  }
}
