import { Injectable } from '@angular/core';
import { CarouselModel } from '../models/carousel.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActividadesModel } from '../models/actividades.model';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  private baseUrl = environment.apiUrl + 'api/v1/carousel';

  constructor(private http: HttpClient) { }

  getAllImages(): Observable<CarouselModel[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<CarouselModel[]>(`${this.baseUrl}/all`, { headers });
  }

  addImage(file: File): Observable<CarouselModel> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<CarouselModel>(
      `${this.baseUrl}/upload`,
      formData,
      { headers }
    );
  }
}
