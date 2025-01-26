import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response.model';
import { VacunaModel } from '../models/vacuna.model';

@Injectable({
  providedIn: 'root'
})
export class VacunaService {
  private baseUrl = environment.apiUrl+'api/vaccinations';

  constructor(private http: HttpClient) {}

  getAllVacunas(): Observable<ResponseModel<VacunaModel[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<VacunaModel[]>>(`${this.baseUrl}`, { headers });
  }

  addVacuna(vacuna: VacunaModel): Observable<ResponseModel<VacunaModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ResponseModel<VacunaModel>>(`${this.baseUrl}`, vacuna, { headers });
  }

  updateVacuna(vacuna: VacunaModel): Observable<ResponseModel<VacunaModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<ResponseModel<VacunaModel>>(`${this.baseUrl}/${vacuna.vaccinationId}`, vacuna, { headers });
  }

  deleteVacuna(vacunaId: number): Observable<ResponseModel<VacunaModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseModel<VacunaModel>>(`${this.baseUrl}/${vacunaId}`, { headers });
  }
}
