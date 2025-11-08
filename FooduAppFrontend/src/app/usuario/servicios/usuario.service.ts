import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Login } from '../interfaces/login';
import { Observable } from 'rxjs';
import { Sesion } from '../interfaces/sesion';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  // baseUrl: string = environment.apiUrl + 'usuario/';
  private baseUrl: string = `${environment.apiUrl}/usuario`;

  constructor(private http: HttpClient) { }

  iniciarSesion(request: Login): Observable<Sesion> {
    return this.http.post<Sesion>(`${this.baseUrl}/login`, request);
  }

  logout(token: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout?token=${token}`, {});
  }


}


