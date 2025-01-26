import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response.model';
import { SettingModel } from '../models/setting.model';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  private baseUrl = environment.apiUrl+'api/settings';

  constructor(private http: HttpClient) {}

  getAllSettings(): Observable<ResponseModel<SettingModel[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<SettingModel[]>>(`${this.baseUrl}`, { headers });
  }

  addSetting(setting: SettingModel): Observable<ResponseModel<SettingModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ResponseModel<SettingModel>>(`${this.baseUrl}`, setting, { headers });
  }

  updateSetting(setting: SettingModel): Observable<ResponseModel<SettingModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<ResponseModel<SettingModel>>(`${this.baseUrl}/${setting}`, setting, { headers });
  }

  deleteSetting(settingId: number): Observable<ResponseModel<SettingModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseModel<SettingModel>>(`${this.baseUrl}/${settingId}`, { headers });
  }
}
