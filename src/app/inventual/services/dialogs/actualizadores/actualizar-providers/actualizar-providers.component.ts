import { Component, ElementRef, inject, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, startWith, switchMap, map } from 'rxjs';
import { EspecialidadModel } from 'src/app/inventual/models/especialidad.model';
import { EspecialidadProveedorModel, ProveedorModel, ProveedorModelString, ResenaModelString } from 'src/app/inventual/models/proveedor.model';
import { GetEspecialidad } from 'src/app/inventual/state-management/especialidad/especialidad.action';
import { SpecialityState } from 'src/app/inventual/state-management/especialidad/especialidad.state';
import { AddProveedor, UpdateProveedor } from 'src/app/inventual/state-management/proveedor/proveedor.action';
import { ProveedorState } from 'src/app/inventual/state-management/proveedor/proveedor.state';
import { ConvertirRutaAImagenService } from 'src/app/inventual/utils/convertir-ruta-aimagen.service';
import { RegistroProveedorComponent } from '../../registro-proveedor/registro-proveedor.component';
import { UsuarioModel } from 'src/app/inventual/models/usuario.model';
import { UsuarioState } from 'src/app/inventual/state-management/usuario/usuario.state';
import { GetUsuario } from 'src/app/inventual/state-management/usuario/usuario.action';

@Component({
  selector: 'app-actualizar-providers',
  templateUrl: './actualizar-providers.component.html',
  styleUrls: ['./actualizar-providers.component.scss']
})
export class ActualizarProvidersComponent implements OnInit {  
  usuarios$: Observable<UsuarioModel[]>;
  usuarios: UsuarioModel[] = [];
  myControlEspecialidad = new FormControl('');
  filteredEspecialidad!: Observable<EspecialidadModel[]>;
  file: File | null = null;
  isLoading$: Observable<boolean> = inject(Store).select(ProveedorState.isLoading);
  @ViewChild('imageContainer') imageContainer!: ElementRef<HTMLDivElement>;
  selectedItemCount: number = 0;
  checked = false;
  provider: ProveedorModel = {
    name: '',
    description: '',
    address: '',
    userId: 0,
    rating: 0,
    status: true
  }
  especialidades$: Observable<EspecialidadModel[]>;
  especialidades: EspecialidadModel[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: ProveedorModel, private utils: ConvertirRutaAImagenService, private router: Router, private _snackBar: MatSnackBar, private store: Store, private dialogRef: MatDialogRef<RegistroProveedorComponent>) {
    this.especialidades$ = this.store.select(SpecialityState.getSpecialities);
    this.usuarios$ = this.store.select(UsuarioState.getUsuarios);
  }
  ngOnInit(): void {
    this.provider = { ...this.data };
    this.store.dispatch([new GetEspecialidad(), new GetUsuario()]);
    this.especialidades$.subscribe((especialidades) => {
      this.especialidades = especialidades;
    });
    this.filteredEspecialidad = this.myControlEspecialidad.valueChanges.pipe(
      startWith(''),
      switchMap(value => this._filterEspecialidades(value || '')),
    );
    this.usuarios$.subscribe((usuarios) => {
      this.usuarios = usuarios;
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  async actualizarProvider() {
    if(this.provider.userId === 0 || this.provider.address ==  "" || this.provider.description == "" || this.provider.name == "" || this.provider.rating === 0) {
      this.openSnackBar('Error en el registro, todos los campos son obligatorios', 'Cerrar');
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
    this.store.dispatch(new UpdateProveedor(this.provider, this.file)).subscribe({
      next: () => {
        console.log('Provider actualizado correctamente:', this.provider);
        this.openSnackBar('Proveedor actualizado correctamente', 'Cerrar');
        this.dialogRef.close();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al actualizado mascota:', error);
        this.openSnackBar('Error en el actualizado, vuelve a intentarlo', 'Cerrar');
      },
    });
  }

  private _filterEspecialidades(value: string): Observable<EspecialidadModel[]> {
    const filterValue = value?.toString().toLowerCase();
    return this.especialidades$.pipe(
      map((especialidades: EspecialidadModel[]) =>
        especialidades.filter(especialidad => especialidad.nameSpecialty.toLowerCase().includes(filterValue))
      )
    );
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
      userId: 0,
      rating: 0,
      status: true,
    }
  }

  displayFnEspecialidad(especialidad: EspecialidadModel): any {
    return especialidad && especialidad.nameSpecialty ? especialidad.nameSpecialty : "";
  }

}
