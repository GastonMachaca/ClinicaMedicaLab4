import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MisTurnosComponent } from 'src/app/components/mis-turnos/mis-turnos.component';
import { UsuariosComponent } from 'src/app/components/usuarios/usuarios.component';

const routes: Routes = [
  {path : '',
    children : [
      {path : 'usuarios', component : UsuariosComponent},
      {path : 'misTurnos', component : MisTurnosComponent},
      {path : 'turnos', component : UsuariosComponent}
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
