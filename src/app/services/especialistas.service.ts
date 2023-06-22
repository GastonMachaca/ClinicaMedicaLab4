import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class EspecialistasService {

  constructor(public firestore: AngularFirestore) { }

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

  public traerEspecialidades()
  {
    const especialidadesCollection = this.firestore.collection('especialidades').valueChanges();

    return especialidadesCollection;
  }

  public traerEspecialistas()
  {
    const especialistasCollection = this.firestore.collection('especialistas').valueChanges();

    return especialistasCollection;
  }


  public agregarNuevaEspecialidad(infoEspecalista : any)
  {
    const especialidadRef = this.firestore.collection('especialidades');
    const especialidad = infoEspecalista;
    especialidadRef.add({ ...especialidad })
    .then(result => {
      this.alertMessage('Nueva especialidad agregada.','Ya puede hacer uso de la misma.','success');
    })
    .catch( (error) =>{
      this.alertMessage('Error al agregar la especialidad','Vuelva a intentarlo','error');
    }); 
  }

  public registrarEspecialista(infoEspecialista  : JSON)
  {
    const especialistaRef = this.firestore.collection('especialistas');
    const especialista = infoEspecialista;
    especialistaRef.add({ ...especialista }); 

  }

}
