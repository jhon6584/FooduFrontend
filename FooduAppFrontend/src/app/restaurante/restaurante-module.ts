import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material-module';
import { Restaurante } from './pages/restaurante/restaurante';
import { CompartidosModule } from '../compartidos/compartidos-module';
import { RestauranteServices } from './servicios/restaurante.service';
import { ModalRestaurante } from './modales/modal-restaurante/modal-restaurante';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    Restaurante,
    ModalRestaurante
  ],
  imports: [
    CommonModule,
    CompartidosModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  providers: [
    RestauranteServices
  ]
})
export class RestauranteModule { }