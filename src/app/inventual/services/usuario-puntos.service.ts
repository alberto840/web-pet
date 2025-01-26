import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response.model';
import { UsuarioPuntosModel } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioPuntosService {
  private baseUrl = environment.apiUrl+'api/user-points';

  constructor(private http: HttpClient) {}

  getAllUsuarioPuntoss(): Observable<ResponseModel<UsuarioPuntosModel[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<UsuarioPuntosModel[]>>(`${this.baseUrl}`, { headers });
  }

  addUsuarioPuntos(usuarioPuntos: UsuarioPuntosModel): Observable<ResponseModel<UsuarioPuntosModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ResponseModel<UsuarioPuntosModel>>(`${this.baseUrl}`, usuarioPuntos, { headers });
  }

  updateUsuarioPuntos(usuarioPuntos: UsuarioPuntosModel): Observable<ResponseModel<UsuarioPuntosModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<ResponseModel<UsuarioPuntosModel>>(`${this.baseUrl}/${usuarioPuntos.userPointsId}`, usuarioPuntos, { headers });
  }

  deleteUsuarioPuntos(usuarioPuntosId: number): Observable<ResponseModel<UsuarioPuntosModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseModel<UsuarioPuntosModel>>(`${this.baseUrl}/${usuarioPuntosId}`, { headers });
  }
}
