import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProveedorModel } from '../models/proveedor.model';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private baseUrl = environment.apiUrl + 'api/providers';

  constructor(private http: HttpClient) { }

  getAllProveedores(): Observable<ResponseModel<ProveedorModel[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<ProveedorModel[]>>(`${this.baseUrl}`, { headers });
  }

  addProveedor(proveedor: ProveedorModel, file: File): Observable<ResponseModel<ProveedorModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const formData = new FormData();
    formData.append('provider', JSON.stringify(proveedor));
    formData.append('file', file);

    return this.http.post<ResponseModel<ProveedorModel>>(
      `${this.baseUrl}`,
      formData,
      { headers }
    );
  }

  updateProveedor(proveedor: ProveedorModel, file: File): Observable<ResponseModel<ProveedorModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const formData = new FormData();
    formData.append('provider', JSON.stringify(proveedor));
    formData.append('file', file);

    return this.http.put<ResponseModel<ProveedorModel>>(
      `${this.baseUrl}/${proveedor.providerId}`,
      formData,
      { headers }
    );
  }

  deleteProveedor(proveedorId: number): Observable<ResponseModel<ProveedorModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseModel<ProveedorModel>>(`${this.baseUrl}/${proveedorId}`, { headers });
  }

  getProveedorById(proveedorId: number): Observable<ResponseModel<ProveedorModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<ProveedorModel>>(`${this.baseUrl}/${proveedorId}`, { headers });
  }
}
