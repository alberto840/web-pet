import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MascotaModel } from '../../models/mascota.model';
import { DialogAccessService } from '../../services/dialog-access.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';
import { UpdateMascota } from '../../state-management/mascota/mascote.action';
import { UtilsService } from '../../utils/utils.service';

@Component({
  selector: 'app-pet-card',
  templateUrl: './pet-card.component.html',
  styleUrls: ['./pet-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PetCardComponent implements OnInit {
  checked = false;
  @ViewChild('imageContainer') imageContainer!: ElementRef<HTMLDivElement>;
  selectedItemCount: number = 0;
  file: File | null = null;
  constructor(public accesDialog: DialogAccessService, private _snackBar: MatSnackBar, private store: Store, public utils: UtilsService) { }
  ngOnInit(): void {
    this.asignarFoto(this.mascota.imageUrl ?? "");
  }
  @Input() mascota!: MascotaModel;

  isProfileEnabled: boolean = false;

  editProfileEnable() {
    if (this.isProfileEnabled == false) {
      this.isProfileEnabled = true;
    }
    else {
      this.isProfileEnabled = false;
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  actualizarCategoria() {
    if (this.mascota.allergies === '' || this.mascota.petBreed === '' || this.mascota.behaviorNotes === '' || this.mascota.gender === '' || this.mascota.petName === '' || this.mascota.species === '') {
      this.openSnackBar('Todos los campos son requeridos', 'Cerrar');
      return;
    }
    this.store.dispatch(new UpdateMascota(this.mascota, this.file)).subscribe({
      next: () => {
        console.log('categoria Actualizado exitosamente');
        this.openSnackBar('categoria Actualizado correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al actualizar categoria:', error);
        this.openSnackBar('El categoria no se pudo actualizar', 'Cerrar');
      }
    });
    this.mascota = {
      ...this.mascota,
      imageUrl: this.file ? URL.createObjectURL(this.file) : this.mascota.imageUrl,
    };
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

  async asignarFoto(url: string) {
    this.utils.urlToFile(url, 'default' + this.mascota.petId).then((file) => {
      this.file = file;
    }).catch((error) => {
      console.error('Error converting URL to file:', error);
    });
  }
}
