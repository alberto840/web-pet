import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response.model';
import { TicketModel } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private baseUrl = environment.apiUrl+'api/support-tickets';

  constructor(private http: HttpClient) {}

  getAllTickets(): Observable<ResponseModel<TicketModel[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<TicketModel[]>>(`${this.baseUrl}`, { headers });
  }

  addTicket(ticket: TicketModel): Observable<ResponseModel<TicketModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ResponseModel<TicketModel>>(`${this.baseUrl}`, ticket, { headers });
  }

  updateTicket(ticket: TicketModel): Observable<ResponseModel<TicketModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<ResponseModel<TicketModel>>(`${this.baseUrl}/${ticket.supportTicketsId}`, ticket, { headers });
  }

  deleteTicket(ticketId: number): Observable<ResponseModel<TicketModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseModel<TicketModel>>(`${this.baseUrl}/${ticketId}`, { headers });
  }
}
