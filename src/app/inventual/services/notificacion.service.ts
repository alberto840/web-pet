import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NotificacionModel } from '../models/notificacion.model';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private baseUrl = environment.apiUrl+'api/notifications';

  constructor(private http: HttpClient) {}

  getAllNotificaciones(): Observable<ResponseModel<NotificacionModel[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<NotificacionModel[]>>(`${this.baseUrl}`, { headers });
  }

  addNotificacion(notificacion: NotificacionModel): Observable<ResponseModel<NotificacionModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ResponseModel<NotificacionModel>>(`${this.baseUrl}`, notificacion, { headers });
  }

  updateNotificacion(notificacion: NotificacionModel): Observable<ResponseModel<NotificacionModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<ResponseModel<NotificacionModel>>(`${this.baseUrl}/${notificacion}`, notificacion, { headers });
  }

  deleteNotificacion(notificacionId: number): Observable<ResponseModel<NotificacionModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseModel<NotificacionModel>>(`${this.baseUrl}/${notificacionId}`, { headers });
  }
}
