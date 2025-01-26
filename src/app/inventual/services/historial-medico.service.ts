import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response.model';
import { Observable } from 'rxjs';
import { HistorialMedicoModel } from '../models/historialMedico.model';

@Injectable({
  providedIn: 'root'
})
export class HistorialMedicoService {
  private baseUrl = environment.apiUrl+'api/medical-histories';

  constructor(private http: HttpClient) {}

  getAllHistorialMedico(): Observable<ResponseModel<HistorialMedicoModel[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<HistorialMedicoModel[]>>(`${this.baseUrl}`, { headers });
  }

  addHistorialMedico(historialMedico: HistorialMedicoModel): Observable<ResponseModel<HistorialMedicoModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ResponseModel<HistorialMedicoModel>>(`${this.baseUrl}`, historialMedico, { headers });
  }

  updateHistorialMedico(historialMedico: HistorialMedicoModel): Observable<ResponseModel<HistorialMedicoModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<ResponseModel<HistorialMedicoModel>>(`${this.baseUrl}/${historialMedico.medicalHistoryId}`, historialMedico, { headers });
  }

  deleteHistorialMedico(historialMedicoId: number): Observable<ResponseModel<HistorialMedicoModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseModel<HistorialMedicoModel>>(`${this.baseUrl}/${historialMedicoId}`, { headers });
  }
}
