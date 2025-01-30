import { Component, ElementRef, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MascotaModel } from 'src/app/inventual/models/mascota.model';
import { MascotaState } from 'src/app/inventual/state-management/mascota/mascota.state';
import { AddMascota } from 'src/app/inventual/state-management/mascota/mascote.action';
import { ConvertirRutaAImagenService } from 'src/app/inventual/utils/convertir-ruta-aimagen.service';

@Component({
  selector: 'app-create-mastcota',
  templateUrl: './create-mastcota.component.html',
  styleUrls: ['./create-mastcota.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateMastcotaComponent implements OnInit {
  file: File | null = null;
  isLoading$: Observable<boolean> = inject(Store).select(MascotaState.isLoading);
  @ViewChild('imageContainer') imageContainer!: ElementRef<HTMLDivElement>;
  selectedItemCount: number = 0;
  checked = false;
  mascota: MascotaModel = {
    petName: '',
    petBreed: '',
    petAge: '',
    weight: 0,
    height: 0,
    gender: '',
    allergies: '',
    behaviorNotes: '',
    userId: 1
  }

  constructor(private utils: ConvertirRutaAImagenService, private router: Router, private _snackBar: MatSnackBar, private store: Store) {

  }
  ngOnInit(): void {
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  async registrarMascota() {
    if (this.mascota.petName === '' || this.mascota.petBreed === '' || this.mascota.petAge === '' || this.mascota.weight === 0 || this.mascota.height === 0 || this.mascota.gender === '' || this.mascota.allergies === '' || this.mascota.behaviorNotes === '') {
      this.openSnackBar('Debe llenar todos los campos', 'Cerrar');
      return;
    }

    if (this.mascota.petName.length < 3) {
      this.openSnackBar('El nombre de la mascota debe tener al menos 3 caracteres', 'Cerrar');
      return;
    }

    // Manejo de la imagen
    if (this.checked === false) {
      // Convertir imagen desde ruta local
      const filePath = '../../../../assets/img/logo/logo.png';
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
    this.store.dispatch(new AddMascota(this.mascota, this.file)).subscribe({
      next: () => {
        console.log('Mascota registrada correctamente:', this.mascota);
        this.openSnackBar('Mascota registrada correctamente', 'Cerrar');
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
    this.mascota = {
      petName: '',
      petBreed: '',
      petAge: '',
      weight: 0,
      height: 0,
      gender: '',
      allergies: '',
      behaviorNotes: '',
      userId: 1
    }
  }

}
