import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompartidosService } from '../compartidos.service';
import { UsuarioService } from '../../usuario/servicios/usuario.service';  

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.html',
  styleUrl: './layout.css',

})
export class Layout implements OnInit {

  usuarioNombre: string = '';

  constructor(private router: Router, private compartidos: CompartidosService, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    const usuarioToken = this.compartidos.obtenerSesion();
    if (usuarioToken != null) {
      this.usuarioNombre = usuarioToken.usuario;
    }
  }

  submenuOpen = false;

  toggleSubmenu(): void {
    this.submenuOpen = !this.submenuOpen;
  }


  // cerrarSesion() {
  //   this.compartidos.eliminarSesion();
  //   this.router.navigate(['/login']);
  // }

 cerrarSesion() {
  const sesion = localStorage.getItem('usuarioSesion');

  if (!sesion) {
    this.router.navigate(['/login']);
    return;
  }

  const token = JSON.parse(sesion).token;

  this.usuarioService.logout(token).subscribe({
    next: (res) => {
      console.log('✅ Sesión cerrada en servidor:', res);
      this.compartidos.eliminarSesion();
      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.error('⚠️ Error al cerrar sesión:', err);
      // Aun así eliminar localmente
      this.compartidos.eliminarSesion();
      this.router.navigate(['/login']);
    },
  });
}



}
