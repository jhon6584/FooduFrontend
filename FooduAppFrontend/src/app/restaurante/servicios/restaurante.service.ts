import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../interfaces/api-response';
import { Cliente } from '../interfaces/cliente';

@Injectable({
  providedIn: 'root',
})
export class RestauranteServices {

  private readonly baseUrl = `${environment.apiUrl.replace(/\/$/, '')}/Cliente`;

  constructor(private http: HttpClient) {}

  buscarOCrear(request: Cliente): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/buscarocrear`, request);
  }

  lista(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl);
  }

  crear(request: Cliente): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseUrl, request);
  }

  editar(request: Cliente): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.baseUrl, request);
  }

  eliminar(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${id}`);
  }
}
