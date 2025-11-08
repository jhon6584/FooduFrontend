import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sesion } from '../usuario/interfaces/sesion';

@Injectable({
  providedIn: 'root',
})
export class CompartidosService {

  constructor(private snackBar: MatSnackBar) { }

  mostrarAlerta(mensaje: string, tipo: string) {
    this.snackBar.open(mensaje, tipo, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 3000
    });
  }

  guardarSesion(sesion: Sesion) {
    localStorage.setItem('usuarioSesion', JSON.stringify(sesion));
  }

  obtenerSesion() {
    const sesionString = localStorage.getItem('usuarioSesion');
    const usuarioToken = JSON.parse(sesionString!);
    return usuarioToken;
  }

  eliminarSesion() {
    localStorage.removeItem('usuarioSesion');
  }



}
