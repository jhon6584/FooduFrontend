import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material-module';
import { Restaurante } from './pages/restaurante/restaurante';
import { CompartidosModule } from '../compartidos/compartidos-module';
import { RestauranteServices } from './servicios/restaurante.service';



@NgModule({
  declarations: [
    Restaurante
  ],
  imports: [
    CommonModule,
    CompartidosModule,
    MaterialModule

  ],
  providers: [
    RestauranteServices
  ]
})
export class RestauranteModule { }
