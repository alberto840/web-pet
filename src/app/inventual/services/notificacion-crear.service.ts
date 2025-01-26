import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response.model';
import { NotificacionCreacionModel } from '../models/notificacion.model';

@Injectable({
  providedIn: 'root'
})
export class NotificacionCrearService {
  private baseUrl = environment.apiUrl+'api/notifications/subscribe-seller';

  constructor(private http: HttpClient) {}

  getAllNotificacionCrears(): Observable<ResponseModel<NotificacionCreacionModel[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<NotificacionCreacionModel[]>>(`${this.baseUrl}`, { headers });
  }
  
  addNotificacionCrear(notificacionCrear: NotificacionCreacionModel): Observable<ResponseModel<NotificacionCreacionModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ResponseModel<NotificacionCreacionModel>>(`${this.baseUrl}`, notificacionCrear, { headers });
  }

  updateNotificacionCrear(notificacionCrear: NotificacionCreacionModel): Observable<ResponseModel<NotificacionCreacionModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<ResponseModel<NotificacionCreacionModel>>(`${this.baseUrl}/${notificacionCrear}`, notificacionCrear, { headers });
  }

  deleteNotificacionCrear(notificacionCrearId: number): Observable<ResponseModel<NotificacionCreacionModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseModel<NotificacionCreacionModel>>(`${this.baseUrl}/${notificacionCrearId}`, { headers });
  }
}
