import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response.model';
import { SubSubCategoriaModel } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class SubsubcategoriaService {
  private baseUrl = environment.apiUrl+'api/subsubcategorias';

  constructor(private http: HttpClient) {}

  getAllSubsubcategorias(): Observable<SubSubCategoriaModel[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<SubSubCategoriaModel[]>(`${this.baseUrl}`, { headers });
  }

  addSubsubcategoria(subsubcategoria: SubSubCategoriaModel): Observable<ResponseModel<SubSubCategoriaModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ResponseModel<SubSubCategoriaModel>>(`${this.baseUrl}`, subsubcategoria, { headers });
  }

  updateSubsubcategoria(subsubcategoria: SubSubCategoriaModel): Observable<ResponseModel<SubSubCategoriaModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<ResponseModel<SubSubCategoriaModel>>(`${this.baseUrl}/${subsubcategoria.subSubCategoriaId}`, subsubcategoria, { headers });
  }

  deleteSubsubcategoria(subsubcategoriaId: number): Observable<ResponseModel<SubSubCategoriaModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseModel<SubSubCategoriaModel>>(`${this.baseUrl}/${subsubcategoriaId}`, { headers });
  }
}
