import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response.model';
import { ReservacionModel } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private baseUrl = environment.apiUrl+'api/reservations';

  constructor(private http: HttpClient) {}

  getAllReservas(): Observable<ResponseModel<ReservacionModel[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<ReservacionModel[]>>(`${this.baseUrl}`, { headers });
  }

  addReserva(reserva: ReservacionModel): Observable<ResponseModel<ReservacionModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ResponseModel<ReservacionModel>>(`${this.baseUrl}`, reserva, { headers });
  }

  updateReserva(reserva: ReservacionModel): Observable<ResponseModel<ReservacionModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<ResponseModel<ReservacionModel>>(`${this.baseUrl}/${reserva.reservationId}`, reserva, { headers });
  }

  deleteReserva(reservaId: number): Observable<ResponseModel<ReservacionModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseModel<ReservacionModel>>(`${this.baseUrl}/${reservaId}`, { headers });
  }
}
