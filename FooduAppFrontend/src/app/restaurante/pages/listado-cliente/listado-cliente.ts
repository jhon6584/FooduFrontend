import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cliente } from '../../interfaces/cliente';
import { RestauranteServices } from '../../servicios/restaurante.service';
import { ModalListadoCliente } from '../../modales/modal-listado-cliente/modal-listado-cliente';

@Component({
  selector: 'app-listado-cliente',
  templateUrl: './listado-cliente.html',
  styleUrls: ['./listado-cliente.css'],
  standalone: false,
})
export class ListadoCliente implements OnInit {
  
  // Columnas de la tabla
  columnasMostradas: string[] = [
    'clienteID', 
    'nombre', 
    'celular', 
    'direccion', 
    'fechaRegistro', 
    'acciones'
  ];
  
  // DataSource para la tabla
  dataSource = new MatTableDataSource<Cliente>();
  
  // Filtro de búsqueda
  filtro: string = '';
  
  // Referencia al paginador
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private restauranteService: RestauranteServices,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Carga todos los clientes desde el servicio
   */
  cargarClientes(): void {
    this.restauranteService.lista().subscribe({
      next: (response) => {
        if (response.isExitoso && response.resultado) {
          this.dataSource.data = response.resultado as Cliente[];
        } else {
          this.mostrarMensaje('Error al cargar clientes');
        }
      },
      error: (error) => {
        console.error('Error:', error);
        this.mostrarMensaje('Error de conexión al servidor');
      }
    });
  }

  /**
   * Aplica filtro a la tabla
   */
  aplicarFiltro(): void {
    this.dataSource.filter = this.filtro.trim().toLowerCase();
  }

  /**
   * Abre diálogo para crear nuevo cliente
   */
  abrirDialogoCliente(cliente?: Cliente): void {
    const dialogRef = this.dialog.open(ModalListadoCliente, {
      width: '500px',
      data: cliente || null
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.cargarClientes(); // Recargar datos
      }
    });
  }

  /**
   * Edita un cliente existente
   */
  editarCliente(cliente: Cliente): void {
    this.abrirDialogoCliente(cliente);
  }

  /**
   * Elimina un cliente con confirmación
   */
  eliminarCliente(cliente: Cliente): void {
    if (!cliente.clienteID) {
      this.mostrarMensaje('Cliente no válido');
      return;
    }

    const confirmacion = confirm(`¿Estás seguro de eliminar al cliente "${cliente.nombre}"?`);
    
    if (confirmacion) {
      this.restauranteService.eliminar(cliente.clienteID).subscribe({
        next: (response) => {
          if (response.isExitoso) {
            this.mostrarMensaje('Cliente eliminado correctamente');
            this.cargarClientes(); // Recargar datos
          } else {
            this.mostrarMensaje('Error al eliminar cliente: ' + response.mensaje);
          }
        },
        error: (error) => {
          console.error('Error:', error);
          this.mostrarMensaje('Error de conexión al servidor');
        }
      });
    }
  }

  /**
   * Muestra mensaje toast
   */
  private mostrarMensaje(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}