import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NotificacionMasivaModel } from '../models/notificacion.model';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class NotificacionMasivaService {
  private baseUrl = environment.apiUrl+'api/notifications/send-massive';

  constructor(private http: HttpClient) {}

  getAllNotificacionMasiva(): Observable<ResponseModel<NotificacionMasivaModel[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<NotificacionMasivaModel[]>>(`${this.baseUrl}`, { headers });
  }

  addNotificacionMasiva(notificacionMasiva: NotificacionMasivaModel): Observable<ResponseModel<NotificacionMasivaModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ResponseModel<NotificacionMasivaModel>>(`${this.baseUrl}`, notificacionMasiva, { headers });
  }

  updateNotificacionMasiva(notificacionMasiva: NotificacionMasivaModel): Observable<ResponseModel<NotificacionMasivaModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<ResponseModel<NotificacionMasivaModel>>(`${this.baseUrl}/${notificacionMasiva}`, notificacionMasiva, { headers });
  }

  deleteNotificacionMasiva(notificacionMasivaId: number): Observable<ResponseModel<NotificacionMasivaModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseModel<NotificacionMasivaModel>>(`${this.baseUrl}/${notificacionMasivaId}`, { headers });
  }
}
