import { Injectable } from '@angular/core';
import { Storage,ref} from '@angular/fire/storage'
import { getDownloadURL, uploadBytes } from 'firebase/storage';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage : Storage) { 

  }

  public urls : any[] = [];

  public subirImagenPaciente(fecha : any, nombre : string, imagen : any, numeroImagen : number)
  {
      let aux = imagen.type.split("/");

      const imgRef = ref(this.storage,`pacientes/${nombre + "_" + fecha + "_imagen_" + numeroImagen + aux[1]}`);

      return uploadBytes(imgRef,imagen);
  }

  public subirImagenEspecialista(fecha : any, nombre : string, imagen : any)
  {
    let aux = imagen.type.split("/");

    const imgRef = ref(this.storage,`especialistas/${nombre + "_" + fecha + "_imagen_1" + '.' + aux[1]}`);

    return uploadBytes(imgRef,imagen);
  }

}
