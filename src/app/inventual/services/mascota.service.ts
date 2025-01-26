import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MascotaModel } from '../models/mascota.model';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  private baseUrl = environment.apiUrl+'api/pets';

  constructor(private http: HttpClient) {}

  getAllMascotas(): Observable<ResponseModel<MascotaModel[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<MascotaModel[]>>(`${this.baseUrl}`, { headers });
  }
  
  addMascota(mascota: MascotaModel): Observable<ResponseModel<MascotaModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ResponseModel<MascotaModel>>(`${this.baseUrl}`, mascota, { headers });
  }

  updateMascota(mascota: MascotaModel): Observable<ResponseModel<MascotaModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<ResponseModel<MascotaModel>>(`${this.baseUrl}/${mascota.petId}`, mascota, { headers });
  }

  deleteMascota(mascotaId: number): Observable<ResponseModel<MascotaModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseModel<MascotaModel>>(`${this.baseUrl}/${mascotaId}`, { headers });
  }
}
