import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidaComponent } from './pages/bienvenida/bienvenida.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthHomeGuard } from './guards/auth-home.guard';
import { UsuarioActivoGuard } from './guards/usuario-activo.guard';


const routes: Routes = [
  {path : '', component: BienvenidaComponent},
  {path : 'registro', component: RegistroComponent},
  {path : 'login', component: LoginComponent, canActivate : [UsuarioActivoGuard]},
  {path : 'home',component : HomeComponent,
    loadChildren : () => import('./pages/home/home.module').then((x) => x.HomeModule), canActivate : [AuthHomeGuard]
  },
  {path : '**', redirectTo : '', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
