import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ProveedorModel } from 'src/app/inventual/models/proveedor.model';
import { AddProveedor } from 'src/app/inventual/state-management/proveedor/proveedor.action';
import { ProveedorState } from 'src/app/inventual/state-management/proveedor/proveedor.state';
import { ConvertirRutaAImagenService } from 'src/app/inventual/utils/convertir-ruta-aimagen.service';

@Component({
  selector: 'app-registro-proveedor',
  templateUrl: './registro-proveedor.component.html',
  styleUrls: ['./registro-proveedor.component.scss']
})
export class RegistroProveedorComponent {
  file: File | null = null;
  userId: string = localStorage.getItem('userId') || '';
  isLoading$: Observable<boolean> = inject(Store).select(ProveedorState.isLoading);
  @ViewChild('imageContainer') imageContainer!: ElementRef<HTMLDivElement>;
  selectedItemCount: number = 0;
  checked = false;
  provider: ProveedorModel = {
    name: '',
    description: '',
    address: '',
    userId: this.userId ? parseInt(this.userId) : 0,
    rating: 0,
    status: true
  }

  constructor(private utils: ConvertirRutaAImagenService, private router: Router, private _snackBar: MatSnackBar, private store: Store, private dialogRef: MatDialogRef<RegistroProveedorComponent>) {

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  async registrarProvider() {
    if (this.provider.name === '' || this.provider.description === '' || this.provider.address === '') {
      this.openSnackBar('Debe llenar todos los campos', 'Cerrar');
      return;
    }

    // Manejo de la imagen
    if (this.checked === false) {
      // Convertir imagen desde ruta local
      const filePath = 'assets/img/logo/logo.png';
      try {
        this.file = await this.utils.convertImagePathToFile(filePath);
      } catch (error) {
        this.openSnackBar('Error al cargar la imagen predeterminada', 'Cerrar');
        console.error('Error al convertir la imagen:', error);
        return;
      }
    }

    // Validar que el archivo esté presente
    if (!this.file) {
      this.openSnackBar('Error en el registro, no se pudo cargar la imagen', 'Cerrar');
      return;
    }

    // Enviar usuario y archivo al store
    this.store.dispatch(new AddProveedor(this.provider, this.file)).subscribe({
      next: () => {
        console.log('Provider registrado correctamente:', this.provider);
        this.openSnackBar('Proveedor registrado correctamente', 'Cerrar');
        this.dialogRef.close();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al registrar mascota:', error);
        this.openSnackBar('Error en el registro, vuelve a intentarlo', 'Cerrar');
      },
    });
  }

  handleFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      this.file = files[0];
      this.selectedItemCount += files.length;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = () => {
          const imgContainer = document.createElement('div');
          imgContainer.classList.add('image-container');

          const img = document.createElement('img');
          img.src = reader.result as string;
          img.classList.add('uploaded-item', 'h-[60px]');

          const deleteIcon = document.createElement('span');
          deleteIcon.classList.add('delete-icon');
          deleteIcon.innerHTML = '<i class="fas fa-trash-alt"></i>';
          deleteIcon.onclick = () => {
            imgContainer.remove();
            this.selectedItemCount--;
          };

          imgContainer.appendChild(img);
          imgContainer.appendChild(deleteIcon);

          this.imageContainer.nativeElement.appendChild(imgContainer);
        };
        // Read the file as a data URL
        reader.readAsDataURL(file);
      }
    }
  }
  
  // Reiniciar formulario
  resetForm() {
    this.provider = {
      name: '',
      description: '',
      address: '',
      userId: this.userId ? parseInt(this.userId) : 0,
      rating: 0,
      status: true,
    }
  }

}
