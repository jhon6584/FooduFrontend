import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Layout } from './layout/layout';
import { Home } from './home/home';
import { MaterialModule } from '../material/material-module';
import { AppRoutingModule } from '../app-routing-module';
import { LayoutRoutingModule } from './layout-routing-module';





@NgModule({
  declarations: [
    Layout,
    Home,
    
  ],
  imports: [
    CommonModule, MaterialModule, LayoutRoutingModule
  ],  
  exports: [ReactiveFormsModule, FormsModule, HttpClientModule, Layout, Home,  MaterialModule]
})
export class CompartidosModule { }
