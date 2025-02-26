import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { map, Observable, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { EspecialidadModel } from 'src/app/inventual/models/especialidad.model';
import { EspecialidadProveedorModel, ProveedorModel } from 'src/app/inventual/models/proveedor.model';
import { UsuarioModel } from 'src/app/inventual/models/usuario.model';
import { GetEspecialidad } from 'src/app/inventual/state-management/especialidad/especialidad.action';
import { SpecialityState } from 'src/app/inventual/state-management/especialidad/especialidad.state';
import { AddProveedor } from 'src/app/inventual/state-management/proveedor/proveedor.action';
import { ProveedorState } from 'src/app/inventual/state-management/proveedor/proveedor.state';
import { GetUsuarioById, UpdateUsuario } from 'src/app/inventual/state-management/usuario/usuario.action';
import { UsuarioByIdState } from 'src/app/inventual/state-management/usuario/usuarioById.state';
import { ConvertirRutaAImagenService } from 'src/app/inventual/utils/convertir-ruta-aimagen.service';
import { UtilsService } from 'src/app/inventual/utils/utils.service';

@Component({
  selector: 'app-registro-proveedor',
  templateUrl: './registro-proveedor.component.html',
  styleUrls: ['./registro-proveedor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegistroProveedorComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  usuario$: Observable<UsuarioModel>;
  usuario: UsuarioModel = {
    userId: 0,
    name: '',
    email: '',
    phoneNumber: '',
    location: '',
    preferredLanguage: '',
    status: false,
    rolId: 0,
    imageUrl: ''
  };
  myControlEspecialidad = new FormControl('');
  filteredEspecialidad!: Observable<EspecialidadModel[]>;
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
  especialidades$: Observable<EspecialidadModel[]>;
  especialidades: EspecialidadModel[] = [];

  relacionEspecialidadProveedor: EspecialidadProveedorModel = {
    specialtyId: 0,
    providerId: 0
  }

  constructor(private utils: ConvertirRutaAImagenService, private router: Router, private _snackBar: MatSnackBar, private store: Store, private dialogRef: MatDialogRef<RegistroProveedorComponent>, private utilityService: UtilsService) {
    this.especialidades$ = this.store.select(SpecialityState.getSpecialities);
    this.usuario$ = this.store.select(UsuarioByIdState.getUsuarioById);
  }
  ngOnInit(): void {
    this.store.dispatch([new GetEspecialidad(), new GetUsuarioById(Number(this.userId))]);
    this.especialidades$.subscribe((especialidades) => {
      this.especialidades = especialidades;
    });
    this.filteredEspecialidad = this.myControlEspecialidad.valueChanges.pipe(
      startWith(''),
      switchMap(value => this._filterEspecialidades(value || '')),
    );
    this.obtenerUsuario(Number(this.userId));
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Emite un valor para desuscribirse
    this.destroy$.complete(); // Completa el Subject
  }

  async obtenerUsuario(userId: number) {
    if (userId === 0) return;
    this.store.dispatch([new GetUsuarioById(userId || 0)]);
    this.store.select(UsuarioByIdState.getUsuarioById)
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (usuario) => {
        if (usuario) {
          this.usuario = {
            userId: usuario.userId,
            name: usuario.name,
            email: usuario.email,
            phoneNumber: usuario.phoneNumber,
            location: usuario.location,
            preferredLanguage: usuario.preferredLanguage,
            status: usuario.status,
            rolId: usuario.rolId,
            imageUrl: usuario.imageUrl
          };
          localStorage.setItem('rolId', "2");
          localStorage.setItem('providerId', usuario.providerId?.toString() || '');
        }
      });
      this.asignarFoto(this.usuario.imageUrl || '');
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  async registrarProvider() {
    this.relacionEspecialidadProveedor.specialtyId = Number(this.myControlEspecialidad.value);
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
    this.store.dispatch(new AddProveedor(this.provider, this.file, this.relacionEspecialidadProveedor)).subscribe({
      next: () => {
        console.log('Provider registrado correctamente:', this.provider);
        this.openSnackBar('Proveedor registrado correctamente', 'Cerrar');
        this.actualizarUsuario();        
        this.dialogRef.close();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al registrar mascota:', error);
        this.openSnackBar('Error en el registro, vuelve a intentarlo', 'Cerrar');
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

  async asignarFoto(url: string) {
    // date in string
    //const date = new Date().toISOString().replace(/:/g, '-');
    this.utilityService.urlToFile(url, 'default' + this.userId).then((file) => {
      this.file = file;
    }).catch((error) => {
      console.error('Error converting URL to file:', error);
    });
  }

  async actualizarUsuario() {
    if (!this.file) {
      this.openSnackBar('Error en el registro, no se pudo cargar la imagen', 'Cerrar');
      return;
    }

    this.usuario.rolId = 2;

    this.store.dispatch(new UpdateUsuario(this.usuario, this.file)).subscribe({
      next: () => {
        console.log('Usuario registrado correctamente:', this.usuario);
        this.openSnackBar('Usuario registrado correctamente', 'Cerrar');
        this.store.dispatch([new GetUsuarioById(Number(this.userId))]);
        this.obtenerUsuario(Number(this.userId));
      },
      error: (error) => {
        console.error('Error al registrar Usuario:', error);
        this.openSnackBar('Error en el registro, vuelve a intentarlo', 'Cerrar');
      },
    });
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

  displayFnEspecialidad(especialidad: EspecialidadModel): any {
    return especialidad && especialidad.nameSpecialty ? especialidad.nameSpecialty : "";
  }

}
