import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Home } from '../compartidos/home/home';
import { Restaurante } from '../restaurante/pages/restaurante/restaurante';
import { ListadoCliente } from '../restaurante/pages/listado-cliente/listado-cliente';
import {} from '../restaurante/restaurante-module';


const routes: Routes = [
  {
    path: '',component: Layout,
    children: [
      { path: 'home', component: Home, pathMatch: 'full' },
      {path: 'restaurante', component: Restaurante, pathMatch: 'full' },
      { path: 'listado-cliente', component: ListadoCliente, pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class LayoutRoutingModule { }
