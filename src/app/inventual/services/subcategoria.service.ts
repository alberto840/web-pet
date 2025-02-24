import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../models/response.model';
import { SubCategoriaModel } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriaService {
  private baseUrl = environment.apiUrl+'api/subcategorias';

  constructor(private http: HttpClient) {}

  getAllSubcategorias(): Observable<SubCategoriaModel[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<SubCategoriaModel[]>(`${this.baseUrl}`, { headers });
  }

  addSubcategoria(subcategoria: SubCategoriaModel): Observable<ResponseModel<SubCategoriaModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ResponseModel<SubCategoriaModel>>(`${this.baseUrl}`, subcategoria, { headers });
  }

  updateSubcategoria(subcategoria: SubCategoriaModel): Observable<SubCategoriaModel> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<SubCategoriaModel>(`${this.baseUrl}/${subcategoria.subCategoriaId}`, subcategoria, { headers });
  }

  deleteSubcategoria(subcategoriaId: number): Observable<ResponseModel<SubCategoriaModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseModel<SubCategoriaModel>>(`${this.baseUrl}/${subcategoriaId}`, { headers });
  }
}
