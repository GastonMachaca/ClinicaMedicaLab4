import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

    constructor(private authService : AuthService, private formBuilder : FormBuilder)
    {

    }

    public loginForm = this.formBuilder.group({
      email : new FormControl('',[Validators.required,Validators.email]),
      password : new FormControl('',[Validators.required]),
    });

    public submitted : boolean = false;

    ngOnInit(): void {
        
    }

    get f() { return this.loginForm.controls; }

    public onSubmit()
    {
        this.submitted = true;

        if(this.loginForm.invalid)
        {
          console.log("Error");
          return;
        }

        
        
        this.authService.login(this.loginForm.value.email ?? '',this.loginForm.value.password ?? '');
    }

    public loginAdmin()
    {
      this.loginForm.controls['email'].setValue("jassougroffezo-3739@yopmail.com");
      this.loginForm.controls['password'].setValue("123456");

      this.onSubmit();
    }

}
