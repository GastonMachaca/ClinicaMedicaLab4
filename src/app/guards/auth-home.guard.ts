import { Injectable,inject} from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthHomeGuard {

  constructor(private router : Router, private authService : AuthService)
  {
    
  }

  async canActivate() {
    
    const user  = await this.authService.statusUser();
    
    const isLooged = user? true : false;

    if(isLooged)
    {
        return true;
    }

    this.router.navigate(['/login']);
    return false;

  }
  
}
