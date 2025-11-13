import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CompartidosService } from '../compartidos.service';
import { UsuarioService } from '../../usuario/servicios/usuario.service';  

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnInit, OnDestroy {

  usuarioNombre: string = '';
  fechaHoraActual: string = '';
  private intervalId: any;

  constructor(
    private router: Router, 
    private compartidos: CompartidosService, 
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    const usuarioToken = this.compartidos.obtenerSesion();
    if (usuarioToken != null) {
      this.usuarioNombre = usuarioToken.usuario;
    }
    
    // Inicializar y actualizar la fecha/hora cada segundo
    this.actualizarFechaHora();
    this.intervalId = setInterval(() => {
      this.actualizarFechaHora();
    }, 1000);
  }

  ngOnDestroy(): void {
    // Limpiar el intervalo cuando el componente se destruya
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

   private actualizarFechaHora(): void {
    const ahora = new Date();
    
    // Nombres de meses en inglés (versión corta)
    const meses = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const dia = ahora.getDate();
    const mes = meses[ahora.getMonth()];
    const año = ahora.getFullYear();
    
    const hora = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    const segundos = ahora.getSeconds().toString().padStart(2, '0');
    
    // Formato: "Nov 11 2024 15:23:45"
    this.fechaHoraActual = `${mes} ${dia} ${año} ${hora}:${minutos}:${segundos}`;
  }

  submenuOpen = false;

  toggleSubmenu(): void {
    this.submenuOpen = !this.submenuOpen;
  }

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