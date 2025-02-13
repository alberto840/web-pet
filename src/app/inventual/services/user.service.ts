import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsuarioModel } from '../models/usuario.model';
import { Observable } from 'rxjs';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseLoginUrl = environment.apiUrl+'api/auth/login';  
  private baseUrl = environment.apiUrl+'api/users';

  constructor(private http: HttpClient) {}
  
  login(user: any): Observable<any> {
    return this.http.post<ResponseModel<any>>(this.baseLoginUrl, user);
  }
  
  getAllUsuarios(): Observable<ResponseModel<UsuarioModel[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<UsuarioModel[]>>(`${this.baseUrl}`, { headers });
  }

  addUsuario(usuario: UsuarioModel, file: File): Observable<ResponseModel<UsuarioModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const formData = new FormData();
    formData.append('user', JSON.stringify(usuario)); // Usuario como JSON
    formData.append('file', file);

    return this.http.post<ResponseModel<UsuarioModel>>(
      `${this.baseUrl}`,
      formData,
      { headers }
    );
  }
  

  updateUsuario(usuario: UsuarioModel, file: File): Observable<ResponseModel<UsuarioModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const formData = new FormData();
    formData.append('user', JSON.stringify(usuario)); // Usuario como JSON
    formData.append('file', file);

    return this.http.put<ResponseModel<UsuarioModel>>(
      `${this.baseUrl}/${usuario.userId}`,
      formData,
      { headers }
    );
  }

  deleteUsuario(usuarioId: number): Observable<ResponseModel<UsuarioModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseModel<UsuarioModel>>(`${this.baseUrl}/${usuarioId}`, { headers });
  }

  getUsuarioById(usuarioId: number): Observable<ResponseModel<UsuarioModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<UsuarioModel>>(`${this.baseUrl}/${usuarioId}`, { headers });
  }

  
}
