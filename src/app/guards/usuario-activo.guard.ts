import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class UsuarioActivoGuard{
  
  constructor(private router : Router, private authService : AuthService)
  {
    
  }

  async canActivate() {
    
    const user  = await this.authService.statusUser();
    
    const isLooged = user? true : false;

    if(isLooged)
    {
        this.router.navigate(['/home']);
        return false;
    }

    return true;

  }
  
}
