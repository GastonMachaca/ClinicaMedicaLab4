import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';


@Directive({
  selector: '[appUserRole]'
})
export class UserRoleDirective implements OnInit{

  public currentUser : any;
  public permissions = [];

  constructor(
    private templateRef : TemplateRef<any>,
    private viewContainer : ViewContainerRef,
    private authService : AuthService
  ) { }

  ngOnInit(): void {
    this.authService.statusUser().then((user) => {
      this.currentUser = user?.email;
    });

  // @Input() set appUserRole(val : Array<string>)
  // {
    
  // }

  }



}
