import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { UsuariosComponent } from 'src/app/components/usuarios/usuarios.component';
import { MisTurnosComponent } from 'src/app/components/mis-turnos/mis-turnos.component';
import { TurnosComponent } from 'src/app/components/turnos/turnos.component';

@NgModule({
  declarations: [
    UsuariosComponent,
    MisTurnosComponent,
    TurnosComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
