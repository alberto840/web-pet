import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConvertirRutaAImagenService {

  constructor() { }
  convertImagePathToFile(filePath: string): Promise<File> {
    return fetch(filePath)
      .then((response) => response.blob())
      .then((blob) => {
        const fileName = filePath.split('/').pop() || 'default.png';
        return new File([blob], fileName, { type: blob.type });
      });
  }
  
}
