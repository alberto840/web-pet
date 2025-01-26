import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response.model';
import { HorarioVacunaModel } from '../models/vacuna.model';

@Injectable({
  providedIn: 'root'
})
export class VacunaHorarioService { 
  private baseUrl = environment.apiUrl+'api/vaccination-schedule';

  constructor(private http: HttpClient) {}

  getAllVacunaHorarios(): Observable<ResponseModel<HorarioVacunaModel[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<HorarioVacunaModel[]>>(`${this.baseUrl}`, { headers });
  }

  addVacunaHorario(vacunaHorario: HorarioVacunaModel): Observable<ResponseModel<HorarioVacunaModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ResponseModel<HorarioVacunaModel>>(`${this.baseUrl}`, vacunaHorario, { headers });
  }

  updateVacunaHorario(vacunaHorario: HorarioVacunaModel): Observable<ResponseModel<HorarioVacunaModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<ResponseModel<HorarioVacunaModel>>(`${this.baseUrl}/${vacunaHorario.vaccinationScheduleId}`, vacunaHorario, { headers });
  }

  deleteVacunaHorario(vacunaHorarioId: number): Observable<ResponseModel<HorarioVacunaModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseModel<HorarioVacunaModel>>(`${this.baseUrl}/${vacunaHorarioId}`, { headers });
  }
}
