import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HorarioAtencionModel } from '../models/horarios.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class HorarioAtencionService {
  private apiUrl = environment.apiUrl + 'api/service-availability';

  constructor(private http: HttpClient) {}

  // Obtener todos los horarios
  getAllHorarios(serviceId: number): Observable<ResponseModel<HorarioAtencionModel[]>> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    return this.http.get<ResponseModel<HorarioAtencionModel[]>>(`${this.apiUrl}/${serviceId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Crear un nuevo horario
  addHorario(serviceId: number, hora: string[]): Observable<ResponseModel<HorarioAtencionModel>> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    return this.http.post<ResponseModel<HorarioAtencionModel>>(`${this.apiUrl}/${serviceId}`, hora, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar un horario
  deleteHorario(id: number): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error en HorarioAtencionService:', error);
    return throwError(() => new Error('Ocurrió un error al procesar la solicitud. Inténtalo de nuevo más tarde.'));
  }
}