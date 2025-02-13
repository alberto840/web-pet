import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductoModel } from '../models/producto.model';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private baseUrl = environment.apiUrl+'api/products';

  constructor(private http: HttpClient) {}

  getAllProductos(): Observable<ResponseModel<ProductoModel[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<ProductoModel[]>>(`${this.baseUrl}`, { headers });
  }

  addProducto(producto: ProductoModel, file: File): Observable<ResponseModel<ProductoModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const formData = new FormData();
    formData.append('product', JSON.stringify(producto)); // Producto como JSON
    formData.append('file', file);
  
    return this.http.post<ResponseModel<ProductoModel>>(
      `${this.baseUrl}`,
      formData,
      { headers }
    );
  }
  
  updateProducto(producto: ProductoModel, file: File): Observable<ResponseModel<ProductoModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const formData = new FormData();
    formData.append('product', JSON.stringify(producto)); // Producto como JSON
    formData.append('file', file);
  
    return this.http.put<ResponseModel<ProductoModel>>(
      `${this.baseUrl}/${producto.productId}`, // Asumiendo que el ID del producto es `productId`
      formData,
      { headers }
    );
  }

  deleteProducto(productoId: number): Observable<ResponseModel<ProductoModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseModel<ProductoModel>>(`${this.baseUrl}/${productoId}`, { headers });
  }

  getProductoById(productoId: number): Observable<ResponseModel<ProductoModel>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<ProductoModel>>(`${this.baseUrl}/${productoId}`, { headers });
  }

  getProductosByProviderId(providerId: number): Observable<ResponseModel<ProductoModel[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseModel<ProductoModel[]>>(`${this.baseUrl}/by-provider/${providerId}`, { headers });
  }
}
