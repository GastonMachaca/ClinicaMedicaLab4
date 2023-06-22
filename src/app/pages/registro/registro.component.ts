import { Component, OnInit, VERSION } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl,FormGroup,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { getDownloadURL } from 'firebase/storage';


///Servicios
import { AuthService } from 'src/app/services/auth.service';
import { EspecialistasService } from 'src/app/services/especialistas.service';
import { PacientesService } from 'src/app/services/pacientes.service';
import { StorageService } from 'src/app/services/storage.service';
import { DomSanitizer } from '@angular/platform-browser';



// import { NgxSpinnerService } from 'ngx-spinner';
//import { ReCaptchaV3Service } from 'ng-recaptcha';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  dato: Date = new Date();
  pipe = new DatePipe('en-US');
  fechaActual : any = null;

  public siteKey : string;

  public prevImgPacientes : Array<string> = [];
  public prevImgEspecialista : string = "";

  perfiles: string[] = ['Paciente', 'Especialista'];
  especialidades: any[] = [];
  
  imagenEspecialista : any[] = [];
  imagenesPaciente : any[] = [];
  
  failImagen : boolean = false;
  mensajeImagen : string = "No se cargo el archivo";
  eventoImagen : any;
  exitoImagen: boolean = false;

  jsonPacientes : any;
  jsonEspecialistas : any;

  nombre : string = "";
  apellido : string = "";
  edad : number = 0;
  dni : number = 0;
  especialidad : string = "";
  newEspecialidad : string = "";
  obraSocial : string = "";
  email : string = "";
  password : string = "";

  errorEdad : string = ""; 
  extraEspecialidad: FormGroup;
  formulario: FormGroup;
  seleccion : string = "";
  opciones : string = "";
  nuevaEspecialidad : boolean = false;
  elementoEspecialidad : string = "";
  submitted : boolean = false;
  newSubmitted : boolean = false;

  transicion : boolean = false;
  transicion2 : boolean = false;
  transicion3 : boolean = false;

  public urlsPacientes : any[] = [];


  constructor(private formBuilder : FormBuilder, 
    private storageService : StorageService, 
    private pacientesService : PacientesService, 
    private especialistaService : EspecialistasService,
    private authService : AuthService,
    private router: Router,
    private sanitizer : DomSanitizer) 
    {
    this.siteKey = "6LfpTZomAAAAAC4kbAjV1mqL0izFAiFbzwgnamU6";

    this.formulario = new FormGroup({
      perfil: new FormControl(null),
      nombre : new FormControl(null),
      apellido : new FormControl(null),
      edad : new FormControl(null), 
      dni : new FormControl(null), 
      especialidad : new FormControl(""),
      obraSocial : new FormControl(null),
      email : new FormControl(null),
      password : new FormControl(null),
      recaptcha : new FormControl(null)
      // primeraFoto : new FormControl(null),
      // segundaFoto : new FormControl(null)
    });

    this.extraEspecialidad = new FormGroup({
      newEspecialidad : new FormControl("")
    })
  }
  
  public onChange(): void 
  { 
    //const newVal = event.target.value; 
    //console.log(newVal);
    //this.seleccion = newVal; 
    //this.seleccion = this.seleccion.substring(3);
   // console.log(this.seleccion);

    this.nombre = this.formulario.value.nombre;
    this.apellido = this.formulario.value.apellido;
    this.dni = this.formulario.value.dni;
    this.edad = this.formulario.value.edad;
    // this.especialidad = this.formulario.value.especialidad;
    this.obraSocial = this.formulario.value.obraSocial;
    this.email = this.formulario.value.email;
    this.password = this.formulario.value.password;

    if(this.seleccion == "Paciente")
    {
      this.opciones = "Obra Social";

      if(this.exitoImagen == true)
      {
        this.cargarImagen(this.eventoImagen);
      }
      else
      {
        this.failImagen = false;
      }

      this.formulario = new FormGroup({
        perfil: new FormControl(this.seleccion),
        nombre: new FormControl(null),
        apellido : new FormControl(null),
        edad: new FormControl(null), 
        dni: new FormControl(null), 
        obraSocial: new FormControl(null),
        email: new FormControl(null),
        password: new FormControl(null),
        recaptcha : new FormControl(null)
      });

      this.asignarValidatorsPaciente(0,80);

      this.errorEdad = "Se introdujo una edad negativa";
      
    }
    else
    {
      this.opciones = "Especialidad";

      if(this.exitoImagen == true)
      {
        this.cargarImagen(this.eventoImagen);
      }
      else
      {
        this.failImagen = false;
      }
      
      console.log("Seleccionaste esp");

      this.formulario = new FormGroup({
        perfil: new FormControl(this.seleccion),
        nombre : new FormControl(null),
        apellido : new FormControl(null),
        edad : new FormControl(null), 
        dni : new FormControl(null), 
        especialidad : new FormControl(""),
        email : new FormControl(null),
        password : new FormControl(null),
        recaptcha : new FormControl(null)
      });

      this.extraEspecialidad = new FormGroup({
        newEspecialidad : new FormControl("")
      })

      this.asignarValidatorsEspecialista();

      this.errorEdad = "Tiene que ser mayor de edad para ser especialista";
    }
  } 

  onSubmit(): void {
    this.submitted = true;

    if(this.nuevaEspecialidad == true)
    {
      this.newSubmitted = true;

      if (this.extraEspecialidad.invalid) 
      {
        return;
      }
    }

    if(this.exitoImagen == true)
    {
      if (this.formulario.invalid) 
      {
        return;
      }
      
      switch(this.seleccion)
      {
        case "Paciente":
            
            this.urlsPacientes = [];
          
            this.authService.register(this.formulario.value.email,this.formulario.value.password).then((user)=>{

              this.jsonPacientes = JSON.stringify(this.formulario.value, null, 2);

              let json = JSON.parse(this.jsonPacientes);

              this.storageService.subirImagenPaciente(this.fechaActual,this.formulario.value.nombre,this.imagenesPaciente[0],0).then(result => {
                getDownloadURL(result.ref).then(data => {
                  json.foto1 = data;
                });
                
                this.storageService.subirImagenPaciente(this.fechaActual,this.formulario.value.nombre,this.imagenesPaciente[1],1).then(result => {
                  getDownloadURL(result.ref).then(data => {
                    json.foto2 = data;
                    this.pacientesService.registrarPaciente(json);
                  });
                });
              });
            });

          break;
        case "Especialista":

          console.log(this.formulario.value);

          this.authService.register(this.formulario.value.email,this.formulario.value.password).then((user)=>{

            this.jsonEspecialistas = JSON.stringify(this.formulario.value, null, 2);

            let json = JSON.parse(this.jsonEspecialistas);

            this.storageService.subirImagenEspecialista(this.fechaActual,this.formulario.value.nombre,this.imagenEspecialista[0]).then((result) =>{
              getDownloadURL(result.ref).then(data => {
                json.foto1 = data;
                json.habilitado = false;

                this.especialistaService.registrarEspecialista(json);
              });
            })



          });
      }
    }
    else
    {
      this.failImagen = true;
    }

  }

  initEspecialidad()
  {
    this.nuevaEspecialidad = true;
    this.newSubmitted = false;
    this.extraValidator();

  }
  
  public cerrarEspecialidad()
  {
    this.extraEspecialidad.controls['newEspecialidad'].reset();
    this.newSubmitted = false;
    this.nuevaEspecialidad = false;
  }

  anadirEspecialidad()
  {
    this.newSubmitted = true;
    if (this.extraEspecialidad.invalid) {
      return;
    }

    console.log(this.extraEspecialidad.value.newEspecialidad);

    this.especialidades.push(this.extraEspecialidad.value.newEspecialidad);

    let jsonEspecialidad : any = {
      especialidad : this.extraEspecialidad.value.newEspecialidad,
      foto : "No Foto"
    }

    this.especialistaService.agregarNuevaEspecialidad(jsonEspecialidad);

    this.extraEspecialidad.controls['newEspecialidad'].reset("");

    this.nuevaEspecialidad = false;
  }
  
  get f(): { [key: string]: AbstractControl } {
    return this.formulario.controls;
  }

  get fp(): { [key: string]: AbstractControl } {
    return this.extraEspecialidad.controls;
  }
  
  public extraValidator()
  {
    this.extraEspecialidad = this.formBuilder.group({
      newEspecialidad: ["", Validators.compose([
        Validators.required,
        Validators.pattern('[a-zA-ZñÑá-úÁ-Ú]{0,254}')])]
    });
  }

  asignarValidatorsEspecialista()
  {
    console.log("Asigno valid especialista");

    this.formulario = this.formBuilder.group(
      {
          dni: [this.dni, Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(8),
            Validators.pattern(/^[1-8]\d{7,7}$/),
        ])],
          nombre: [this.nombre, Validators.compose([
            Validators.required,
            Validators.pattern('[a-zA-ZñÑá-úÁ-Ú]{0,254}')
        ])],
          apellido: [this.nombre, Validators.compose([
            Validators.required,
            Validators.pattern('[a-zA-ZñÑá-úÁ-Ú]{0,254}')
          ])],
          edad: [this.edad, Validators.compose([
            Validators.required,
            Validators.min(18),
            Validators.max(80),
            Validators.pattern('^[0-9]*$')
        ])],
          perfil: [this.seleccion, Validators.compose([
            Validators.required
        ])],
        especialidad: [this.especialidad, Validators.compose([
          Validators.required
        ])],
          email: [this.email, Validators.compose([
            Validators.required, 
            Validators.email
        ])],
          password: [this.password, Validators.compose([
           Validators.required,
           Validators.minLength(6)
        ])],
          recaptcha: [null, Validators.compose([
            Validators.required
        ])]
      }
    );
  }

  asignarValidatorsPaciente(edadMin : number,edadMax : number)
  {
    this.formulario = this.formBuilder.group(
      {
          dni: [this.dni, Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(8),
            Validators.pattern(/^[1-8]\d{7,7}$/),
        ])],
          nombre: [this.nombre, Validators.compose([
            Validators.required,
            Validators.pattern('[a-zA-ZñÑá-úÁ-Ú]{0,254}')
        ])],
          apellido: [this.nombre, Validators.compose([
            Validators.required,
            Validators.pattern('[a-zA-ZñÑá-úÁ-Ú]{0,254}')
          ])],
          edad: [this.edad, Validators.compose([
            Validators.required,
            Validators.min(edadMin),
            Validators.max(edadMax),
            Validators.pattern('^[0-9]*$')
        ])],
          obraSocial: [this.obraSocial, Validators.compose([
            Validators.required,
            Validators.pattern('[a-zA-ZñÑá-úÁ-Ú]{0,254}')
        ])],
          perfil: [this.seleccion, Validators.compose([
            Validators.required
        ])],
          email: [this.email, Validators.compose([
            Validators.required, 
            Validators.email
        ])],
          password: [this.password, Validators.compose([
            Validators.required,
            Validators.minLength(6)
        ])],
          recaptcha: [null, Validators.compose([
            Validators.required
        ])]
      }
    );
  }




  ngOnInit(): void {
    this.fechaActual = this.pipe.transform(Date.now(), 'd-M-yy, h:mm a');
    this.transicion = true;

    this.especialistaService.traerEspecialidades().subscribe(result => {
      this.especialidades = result;
    });

    // setTimeout(() => {
    //   this.transicion = true;
    // }, 790);

  }

  cargarImagen(event : any)
  {
    this.eventoImagen = event;

    switch(this.seleccion)
    {
      case "Paciente":

        if(this.mensajeImagen != "")
        {   
          if(event.target.files.length == 2)
          { 
            this.prevImgPacientes.splice(0);
            this.failImagen = false;
            this.exitoImagen = true;
            
            if(this.imagenesPaciente.length > 0)
            {
              this.imagenesPaciente.splice(0);
              console.log("Numero:" + this.imagenesPaciente.length);
            }

            for(let i = 0;i<2;i++)
            {
              const file = event.target.files[i];

              this.imagenesPaciente.push(file);

              this.extraerBase64(file).then((img : any) => {
                console.log(img);
                this.prevImgPacientes.push(img.base);
              });

              console.log(this.imagenesPaciente);
            }
          }
          else
          {
            this.failImagen = true;
            this.exitoImagen = false;
            this.mensajeImagen = "Error,debe ingresar 2 imagenes";
          }
        }
        else
        {
          console.log(this.mensajeImagen);
          if(this.mensajeImagen == "")
          {
            console.log("xd5")
            this.mensajeImagen = "Debe ingresar su Imagen";
          }
        }
      
        break;
      case "Especialista":

        if(this.mensajeImagen != "")
        {
            if(event.target.files.length == 1)
            {
              this.failImagen = false;
              this.exitoImagen = true;

              if(this.imagenEspecialista.length > 0)
              {
                this.imagenEspecialista.splice(0);
              }
    
              const file = event.target.files[0];
              this.imagenEspecialista.push(file);

              this.extraerBase64(file).then((img : any) => {
                console.log(img);
                this.prevImgEspecialista = img.base;
              });

            }
            else
            {
              this.failImagen = true;
              this.exitoImagen = false;
              this.mensajeImagen = "Error,debe ingresar 1 imagen";
            }
        }
        else
        {
          if(this.mensajeImagen == "")
          {
            this.mensajeImagen = "Debe ingresar su Imagen";
          }
        }

        break;
    }
  }

  public restaurarSeleccion()
  {
    this.formulario.reset();
    this.mensajeImagen = "No se cargo el archivo";
    this.prevImgEspecialista = "";
    this.failImagen = false;
    this.exitoImagen = false;
    this.prevImgPacientes = [];
    this.submitted = false;
    this.newSubmitted = false;
    this.transicion3 = false;
  }

  transicionRegistro(seleccion : string)
  {
    this.transicion2 = true;

    this.seleccion = seleccion;

    switch(seleccion)
    {
      case "Especialista":
        this.opciones = "Especialidad";
        this.onChange();
        break;
      
      case "Paciente":
        this.opciones = "Paciente";
        this.onChange();
        break;
    }

    setTimeout(() => {
      this.transicion3 = true;
    }, 360);
  }

  extraerBase64 = async ($event : any) => new Promise((resolve,reject) => {
    try{
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);

      reader.onload = () => {
        resolve({
          blob : $event,
          image,
          base : reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          blob : $event,
          image,
          base : null
        });
      };

      return;

    } catch (e) {
      return null;
    }
  })

}
