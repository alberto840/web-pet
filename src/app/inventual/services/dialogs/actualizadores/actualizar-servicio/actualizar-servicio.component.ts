import { ChangeDetectorRef, Component, ElementRef, inject, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, startWith, switchMap, map } from 'rxjs';
import { CategoriaModel, SubCategoriaModel, SubSubCategoriaModel } from 'src/app/inventual/models/categoria.model';
import { ServicioModel, ServicioModelString } from 'src/app/inventual/models/producto.model';
import { ProveedorModel, ResenaModel } from 'src/app/inventual/models/proveedor.model';
import { getCategorias } from 'src/app/inventual/state-management/categoria/categoria.action';
import { CategoriaState } from 'src/app/inventual/state-management/categoria/categoria.state';
import { GetProveedor } from 'src/app/inventual/state-management/proveedor/proveedor.action';
import { ProveedorState } from 'src/app/inventual/state-management/proveedor/proveedor.state';
import { AddServicio, UpdateServicio } from 'src/app/inventual/state-management/servicio/servicio.action';
import { ServicioState } from 'src/app/inventual/state-management/servicio/servicio.state';
import { GetSubcategoria } from 'src/app/inventual/state-management/subcategoria/subcategoria.action';
import { SubcategoriaState } from 'src/app/inventual/state-management/subcategoria/subcategoria.state';
import { GetSubsubcategoria } from 'src/app/inventual/state-management/subsubcategoria/subsubcategoria.action';
import { SubsubcategoriaState } from 'src/app/inventual/state-management/subsubcategoria/subsubcategoria.state';
import { ConvertirRutaAImagenService } from 'src/app/inventual/utils/convertir-ruta-aimagen.service';
import { DialogAccessService } from '../../../dialog-access.service';
import { CreateServicioComponent } from '../../create-servicio/create-servicio.component';
import { UtilsService } from 'src/app/inventual/utils/utils.service';
import { AddHorarioAtencion, getHorarioAtencion } from 'src/app/inventual/state-management/horarioAtencion/horarioAtencion.action';
import { HorarioState } from 'src/app/inventual/state-management/horarioAtencion/horarioAtencion.state';
import { HorarioAtencionModel } from 'src/app/inventual/models/horarios.model';

@Component({
  selector: 'app-actualizar-servicio',
  templateUrl: './actualizar-servicio.component.html',
  styleUrls: ['./actualizar-servicio.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ActualizarServicioComponent implements OnInit {
  isLoadingHorarios$: Observable<boolean> = inject(Store).select(HorarioState.isLoading);

  horarios$: Observable<HorarioAtencionModel[]>;
  isLoading$: Observable<boolean> = inject(Store).select(CategoriaState.isLoading);
  isLoadingServicios$: Observable<boolean> = inject(Store).select(ServicioState.isLoading);
  subCatIsLoading$: Observable<boolean> = inject(Store).select(SubcategoriaState.isLoading);
  subSubCatIsLoading$: Observable<boolean> = inject(Store).select(SubsubcategoriaState.isLoading);
  proveedorIsLoading$: Observable<boolean> = inject(Store).select(ProveedorState.isLoading);

  filteredProveedor!: Observable<ProveedorModel[]>;
  filteredCategoria!: Observable<CategoriaModel[]>;
  filteredSubCategoria!: Observable<SubCategoriaModel[]>;
  filteredSubSubCategoria!: Observable<SubSubCategoriaModel[]>;

  categorias$: Observable<CategoriaModel[]>;
  subcategorias$: Observable<SubCategoriaModel[]>;
  subsubcategorias$: Observable<SubSubCategoriaModel[]>;
  proveedores$: Observable<ProveedorModel[]>;

  categories: CategoriaModel[] = [];
  subcategories: SubCategoriaModel[] = [];
  subsubcategories: SubSubCategoriaModel[] = [];
  proveedores: ProveedorModel[] = [];

  myControlCategorias = new FormControl('');
  myControlSubCategorias = new FormControl('');
  myControlSubSubCategorias = new FormControl('');
  myControlProveedores = new FormControl('');

  file: File | null = null;

  @ViewChild('imageContainer') imageContainer!: ElementRef<HTMLDivElement>;
  selectedItemCount: number = 0;
  checked = true;

  proveedor: ProveedorModel = {
    providerId: 0,
    name: '',
    description: '',
    address: '',
    userId: 0,
    rating: 0,
    status: true,
    verified: false,
    phone: ''
  }
  categoria: CategoriaModel = {
    categoryId: 0,
    nameCategory: '',
    icono: ''
  }
  subcategoria: SubCategoriaModel = {
    subCategoriaId: 0,
    nameSubCategoria: '',
    categoryId: 0
  }
  subsubcategoria: SubSubCategoriaModel = {
    subSubCategoriaId: 0,
    nameSubSubCategoria: '',
    subCategoriaId: 0
  }
  servicio: ServicioModel = {
    serviceId: 0,
    serviceName: '',
    price: 0,
    duration: 0,
    description: '',
    status: true,
    providerId: 0,
    imageId: null,
    tipoAtencion: '',
    imageUrl: '',
    categoryId: 0,
    onSale: false,
    provider: {} as ProveedorModel
  }
  horarios: HorarioAtencionModel[] = [];
  hora: string = '';
  minutos: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: ServicioModel, private cdr: ChangeDetectorRef, private utils: ConvertirRutaAImagenService, private router: Router, private _snackBar: MatSnackBar, private store: Store, public dialogService: DialogAccessService, private dialogRef: MatDialogRef<CreateServicioComponent>, private utilsService: UtilsService) {
    this.categorias$ = this.store.select(CategoriaState.getCategorias);
    this.subcategorias$ = this.store.select(SubcategoriaState.getSubcategorias);
    this.subsubcategorias$ = this.store.select(SubsubcategoriaState.getSubsubcategorias);
    this.proveedores$ = this.store.select(ProveedorState.getProveedores);
    if (data) {
      this.servicio = {
        serviceId: data.serviceId,
        serviceName: data.serviceName,
        price: data.price,
        duration: data.duration,
        description: data.description,
        status: data.status,
        providerId: data.providerId,
        imageId: data.imageId,
        tipoAtencion: data.tipoAtencion,
        imageUrl: data.imageUrl,
        categoryId: data.categoryId,
        onSale: data.onSale,
        provider: data.provider || {} as ProveedorModel
      };
    }
    this.horarios$ = this.store.select(HorarioState.getHorarios);
    this.horarios$.subscribe(horarios => {
      this.horarios = horarios;
    });
  }
  ngAfterViewInit(): void {
    this.cdr.detectChanges(); // Forzar la detección de cambios
  }

  async asignarFoto(url: string) {
    // date in string
    //const date = new Date().toISOString().replace(/:/g, '-');
    this.utilsService.urlToFile(url, 'default' + this.servicio.imageId).then((file) => {
      this.file = file;
    }).catch((error) => {
      console.error('Error converting URL to file:', error);
    });
  }
  ngOnInit(): void {
    this.store.dispatch([new getHorarioAtencion(this.servicio.serviceId), new getCategorias(), new GetSubcategoria(), new GetSubsubcategoria(), new GetProveedor()]);
    this.asignarFoto(this.servicio.imageUrl ?? "");
    this.filteredProveedor = this.myControlProveedores.valueChanges.pipe(
      startWith(''),
      switchMap(value => this._filterProveedor(value || '')),
    );
    this.filteredCategoria = this.myControlCategorias.valueChanges.pipe(
      startWith(''),
      switchMap(value => this._filterCategoria(value || ''))
    );
    this.filteredSubCategoria = this.myControlSubCategorias.valueChanges.pipe(
      startWith(''),
      switchMap(value => this._filterSubCategoria(value || '')),
    );
    this.filteredSubSubCategoria = this.myControlSubSubCategorias.valueChanges.pipe(
      startWith(''),
      switchMap(value => this._filterSubSubCategoria(value || '')),
    );
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  async actualizarServicio() {
    if (this.servicio.serviceName === '' || this.servicio.price === 0 || this.servicio.duration === 0 || this.servicio.description === '') {
      this.openSnackBar('Debe llenar todos los campos', 'Cerrar');
      return;
    }

    if (this.servicio.serviceName.length < 3) {
      this.openSnackBar('El nombre del servicio debe tener al menos 3 caracteres', 'Cerrar');
      return;
    }

    // Validar que el archivo esté presente
    if (!this.file) {
      this.openSnackBar('Error en el registro, no se pudo cargar la imagen', 'Cerrar');
      return;
    }

    // Enviar usuario y archivo al store
    this.store.dispatch(new UpdateServicio(this.servicio, this.file)).subscribe({
      next: () => {
        console.log('Servicio registrado correctamente:', this.servicio);
        this.openSnackBar('Servicio registrado correctamente', 'Cerrar');
        this.dialogRef.close();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al registrar Servicio:', error);
        this.openSnackBar('Error en el registro, vuelve a intentarlo', 'Cerrar');
      },
    });
  }

  agregarHorario() {
    const horaStr = String(this.hora); // Convierte a cadena
    const minutosStr = String(this.minutos); // Convierte a cadena
    if (this.hora === '' || this.minutos === '') {
      this.openSnackBar('Debe llenar hora y minutos', 'Cerrar');
      return;
    }
    if (parseInt(this.hora) > 23 || parseInt(this.hora) < 0) {
      this.openSnackBar('Hora invilida, formato 24h', 'Cerrar');
      return;
    }
    if (parseInt(this.minutos) > 59 || parseInt(this.minutos) < 0) {
      this.openSnackBar('Minutos inválidos', 'Cerrar');
      return;
    }
    // Construye la cadena de hora en formato HH:mm:ss
    const horaCompleta = `${horaStr.padStart(2, '0')}:${minutosStr.padStart(2, '0')}:00`;
    const arreglo = [horaCompleta];
    return arreglo;
  }

  crearHorarios() {
    this.store.dispatch(new AddHorarioAtencion(this.agregarHorario(), this.servicio.serviceId)).subscribe({
      next: () => {
        this.openSnackBar('Horario registrado correctamente', 'Cerrar');
        console.log('Horarios registrado correctamente:', this.agregarHorario());
        this.store.dispatch(new getHorarioAtencion(this.servicio.serviceId));
      },
      error: (error) => {
        console.error('Error al registrar horarios:', error);
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

  private _filterCategoria(value: string): Observable<CategoriaModel[]> {
    const filterValue = value?.toString().toLowerCase();
    return this.categorias$.pipe(
      map((categorias: CategoriaModel[]) =>
        categorias.filter(categoria => categoria.nameCategory.toLowerCase().includes(filterValue))
      )
    );
  }

  private _filterSubCategoria(value: string): Observable<SubCategoriaModel[]> {
    const filterValue = value?.toString().toLowerCase();
    return this.subcategorias$.pipe(
      map((subcategorias: SubCategoriaModel[]) =>
        subcategorias.filter(subcategorias => subcategorias.nameSubCategoria.toLowerCase().includes(filterValue))
      )
    );
  }

  private _filterSubSubCategoria(value: string): Observable<SubSubCategoriaModel[]> {
    const filterValue = value?.toString().toLowerCase();
    return this.subsubcategorias$.pipe(
      map((subsubcategorias: SubSubCategoriaModel[]) =>
        subsubcategorias.filter(subsubcategorias => subsubcategorias.nameSubSubCategoria.toLowerCase().includes(filterValue))
      )
    );
  }

  private _filterProveedor(value: string): Observable<ProveedorModel[]> {
    const filterValue = value?.toString().toLowerCase();
    return this.proveedores$.pipe(
      map((proveedores: ProveedorModel[]) =>
        proveedores.filter(proveedor => proveedor.name.toLowerCase().includes(filterValue))
      )
    );
  }

  selectProveedor(proveedor: ProveedorModel) {
    this.proveedor = proveedor;
    this.servicio.providerId = proveedor.providerId ?? 0;
  }

  selectCategoria(categoria: CategoriaModel) {
    this.categoria = categoria;
    //this.producto.categoryId = categoria.categoryId ?? 0;
  }

  selectSubCategoria(subcategoria: SubCategoriaModel) {
    this.subcategoria = subcategoria;
  }

  selectSubSubCategoria(subsubcategoria: SubSubCategoriaModel) {
    this.subsubcategoria = subsubcategoria;
  }

  displayFnProveedor(proveedor: ProveedorModel): any {
    return proveedor && proveedor.name ? proveedor.name : "";
  }

  displayFnCategoria(categoria: CategoriaModel): any {
    return categoria && categoria.nameCategory ? categoria.nameCategory : "";
  }

  displayFnSubCategoria(subcategoria: SubCategoriaModel): any {
    return subcategoria && subcategoria.nameSubCategoria ? subcategoria.nameSubCategoria : "";
  }

  displayFnSubSubCategoria(subsubcategoria: SubSubCategoriaModel): any {
    return subsubcategoria && subsubcategoria.nameSubSubCategoria ? subsubcategoria.nameSubSubCategoria : "";
  }

  // Reiniciar formulario
  resetForm() {
    this.servicio = {
      serviceId: 0,
      serviceName: '',
      price: 0,
      duration: 0,
      description: '',
      status: false,
      providerId: 0,
      imageId: null,
      tipoAtencion: '',
      imageUrl: '',
      categoryId: 0,
      onSale: false,
      provider: {} as ProveedorModel
    };
    this.categoria = {
      categoryId: 0,
      nameCategory: '',
      icono: ''
    };
    this.subcategoria = {
      subCategoriaId: 0,
      nameSubCategoria: '',
      categoryId: 0
    };
    this.subsubcategoria = {
      subSubCategoriaId: 0,
      nameSubSubCategoria: '',
      subCategoriaId: 0
    };
    this.proveedor = {
      name: '',
      description: '',
      address: '',
      userId: 0,
      rating: 0,
      status: true,
      verified: false,
      phone: ''
    };
  }

}
