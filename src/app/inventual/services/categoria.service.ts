import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoriaModel } from '../models/categoria.model';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private baseUrl = environment.apiUrl+'api/categories';

  constructor(private http: HttpClient) {}

  getAllCategorias(): Observable<ResponseModel<CategoriaModel[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<CategoriaModel[]>>(`${this.baseUrl}`, { headers });
  }

  addCategoria(categoria: CategoriaModel): Observable<ResponseModel<CategoriaModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ResponseModel<CategoriaModel>>(`${this.baseUrl}`, categoria, { headers });
  }

  updateCategoria(categoria: CategoriaModel): Observable<ResponseModel<CategoriaModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<ResponseModel<CategoriaModel>>(`${this.baseUrl}/${categoria.categoryId}`, categoria, { headers });
  }

  deleteCategoria(categoriaId: number): Observable<ResponseModel<CategoriaModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseModel<CategoriaModel>>(`${this.baseUrl}/${categoriaId}`, { headers });
  }
}
