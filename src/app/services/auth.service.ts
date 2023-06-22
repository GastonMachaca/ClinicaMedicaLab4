import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import Swal from 'sweetalert2';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';

import { firstValueFrom } from 'rxjs';
import { EspecialistasService } from './especialistas.service';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afauth: AngularFireAuth, public firestore : AngularFirestore,public router: Router, private especialistaService : EspecialistasService) { }

  private alertMessage = (title: any,text: any,icon: any) =>
  {
    Swal.fire({ 
      toast: true, 
      position: 'top-end', 
      showConfirmButton: false,
      timer: 3000, 
      title, 
      text, 
      icon, 
    });
  }

  public register(email: string , password : string)
  {
      return this.afauth.createUserWithEmailAndPassword(email,password).then((result) => {

        this.alertMessage('Registro Exitoso, se envio correo para verificacion de usuario.','Redirigiendo a Login... Espere unos segundos','success');
        result.user?.sendEmailVerification();
        // this.firestore.collection("usuarios").doc(username).set({email : email, username : username})

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);

      }).catch((error) => {

        switch(error.code)
        {
          case "auth/email-already-in-use": 
            this.alertMessage('Email existente','El email ingresado ya esta vinculado a un usuario','error');
            break;
          default:
            this.alertMessage('Error al ingresar','Vuelva a intentarlo','error');
            break;
        }

      });
  }

  public login(email: string , password : string)
  {
    return this.afauth.signInWithEmailAndPassword(email,password).then((result) => {
        
        if(result.user?.emailVerified)
        {
          // this.alertMessage('Usuario verificado','Genial','success');

          // this.especialistaService.traerEspecialistas().subscribe(result => {
          //   result.forEach((element : any) => {
          //       if(element.email == email)
          //       {
          //           if(element.habilitado == true)
          //           {
          //             this.alertMessage('Usuario aprobado','Espere unos segundos y sera reedirigido','success');

          //             setTimeout(() => {
          //               this.router.navigate(['/home']);
          //             }, 3000);

          //           }
          //           else
          //           {
          //             this.alertMessage('Falta aprobacion Admin','Por favor, contacte al administrador para habilitar su usuario','error');
          //           }
          //       }
          //   });
          // });

          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 3000);
        }
        else
        {
          this.alertMessage('Usuario no verificado','Por favor, verifique el correo asociado al usuario','error');
        }

    }).catch((error) => {
      switch(error.code)
      {
        case "auth/user-not-found": 
          this.alertMessage('Email no encontrado','No existe un usuario con el email ingresado','error');
          break;
        case "auth/wrong-password":
          this.alertMessage('Contraseña Incorrecta','Vuelva a intentarlo','error');
          break;
        default:
          this.alertMessage('Error al ingresar','Vuelva a intentarlo','error');
          break;
      }
    });
  }

  public logOut() {
    try {
      this.afauth.signOut();
      this.router.navigate(['/login']);
    }
    catch (error) {
      console.log(error);
    }
  }

  async statusUser() {
    return await firstValueFrom(this.afauth.authState);
  } 

  ///// Servicios Administrador /////

  public verifyAdmin()
  {
    const especialistaCollection = this.firestore.collection('administradores').valueChanges();

    return especialistaCollection;
  }

  
}
