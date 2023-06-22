import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class PacientesService {

  constructor(public firestore: AngularFirestore) { }

  public registrarPaciente(infoPaciente  : JSON)
  {
    const pacienteRef = this.firestore.collection('pacientes');
    const paciente = infoPaciente;
    pacienteRef.add({ ...paciente }); 

  }

  public traerPacientes()
  {
    const pacientesCollection = this.firestore.collection('pacientes').valueChanges();

    return pacientesCollection;
  }

}
