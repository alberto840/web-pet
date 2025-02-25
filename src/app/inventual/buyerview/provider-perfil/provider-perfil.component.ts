import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ProveedorState } from '../../state-management/proveedor/proveedor.state';
import { ProveedorModel, ResenaModel } from '../../models/proveedor.model';
import { ProviderByIdState } from '../../state-management/proveedor/proveedorById.state';
import { GetProveedorById, UpdateProveedor } from '../../state-management/proveedor/proveedor.action';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DialogAccessService } from '../../services/dialog-access.service';
import { CountryInfo, countries } from '../../utils/paises_data';
import { UtilsService } from '../../utils/utils.service';
import { GetUsuarioById } from '../../state-management/usuario/usuario.action';
import { UsuarioModel } from '../../models/usuario.model';
import { UsuarioByIdState } from '../../state-management/usuario/usuarioById.state';
import { GetServiciosByProvider } from '../../state-management/servicio/servicio.action';
import { GetProductosByProvider } from '../../state-management/producto/producto.action';
import { ProductoByProviderState } from '../../state-management/producto/productoByProvider.state';
import { ServiceByProviderState } from '../../state-management/servicio/servicioByProvider.state';
import { ServicioModel, ProductoModel } from '../../models/producto.model';
import { ResenasByProviderIdState } from '../../state-management/resena/resenaByProviderId.state';
import { GetResenasByProviderId } from '../../state-management/resena/resena.action';

@Component({
  selector: 'app-provider-perfil',
  templateUrl: './provider-perfil.component.html',
  styleUrls: ['./provider-perfil.component.scss']
})
export class ProviderPerfilComponent implements OnInit {
  private destroy$ = new Subject<void>();
  @ViewChild('imageContainer') imageContainer!: ElementRef<HTMLDivElement>;
  selectedItemCount: number = 0;
  file: File | null = null;
  checked = false;
  selectedStars: number = 0;
  rate(stars: number) {
    this.selectedStars = stars;
  }
  countryList: CountryInfo[] = [];
  cityList: string[] = [];
  pais: string = '';
  ciudad: string = '';
  providerId: number = 0;
  isLoading$: Observable<boolean> = inject(Store).select(ProviderByIdState.isLoading);
  proveedor$: Observable<ProveedorModel>;
  proveedor: ProveedorModel = {
    providerId: 0,
    name: '',
    description: '',
    address: '',
    userId: 0,
    rating: 0,
    status: false,
    imageUrl: ''
  };
  proveedorUpdate: ProveedorModel = {
    name: '',
    description: '',
    address: '',
    userId: 0,
    rating: 0,
    status: false,
    imageUrl: ''
  };
  userId: number = 0;
  isLoadingUser$: Observable<boolean> = inject(Store).select(UsuarioByIdState.isLoading);
  usuario$: Observable<UsuarioModel>;
  usuario: UsuarioModel = {
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    location: '',
    preferredLanguage: '',
    status: false,
    rolId: 0
  };
  isLoadingServices$: Observable<boolean> = inject(Store).select(ServiceByProviderState.isLoading);
  servicios: ServicioModel[] = [];
  servicios$: Observable<ServicioModel[]>;
  isLoadingProductos$: Observable<boolean> = inject(Store).select(ProductoByProviderState.isLoading);
  productos: ProductoModel[] = [];
  productos$: Observable<ProductoModel[]>;
  reviews: ResenaModel[] = [];
  reviews$: Observable<ResenaModel[]>;

  constructor(private route: ActivatedRoute, public router: Router, private store: Store, public dialogAccess: DialogAccessService, private _snackBar: MatSnackBar, public utils: UtilsService) {
    this.proveedor$ = this.store.select(ProviderByIdState.getProveedorById);
    this.usuario$ = this.store.select(UsuarioByIdState.getUsuarioById);
    this.servicios$ = this.store.select(ServiceByProviderState.getServiciosByProvider);
    this.productos$ = this.store.select(ProductoByProviderState.getProductosByProvider);
    this.reviews$ = this.store.select(ResenasByProviderIdState.getResenasByProviderId);
  }
  //sidebar menu activation start
  menuSidebarActive: boolean = false;
  isProfileEnabled: boolean = false;
  myfunction() {
    if (this.menuSidebarActive == false) {
      this.menuSidebarActive = true;
    }
    else {
      this.menuSidebarActive = false;
    }
  }

  editProfileEnable() {
    if (this.isProfileEnabled == false) {
      this.isProfileEnabled = true;
    }
    else {
      this.isProfileEnabled = false;
    }
  }

  async actualizarProveedor() {
    if (this.proveedorUpdate.name === '' || this.proveedorUpdate.description === '' || this.proveedorUpdate.address === '') {
      this.openSnackBar('Por favor, llene todos los campos', 'Cerrar');
      return;
    }
    if (!this.file) {
      this.openSnackBar('Error en el registro, no se pudo cargar la imagen', 'Cerrar');
      return;
    }

    this.store.dispatch(new UpdateProveedor(this.proveedorUpdate, this.file)).subscribe({
      next: () => {
        console.log('Proveedor registrado correctamente:', this.proveedorUpdate);
        this.openSnackBar('Proveedor registrado correctamente', 'Cerrar');
        this.store.dispatch([new GetUsuarioById(Number(this.userId))]);
        this.isProfileEnabled = false;
      },
      error: (error) => {
        console.error('Error al registrar Proveedor:', error);
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

  public ciudadesDelPais(pais: CountryInfo) {
    //this.proveedor.preferredLanguage = pais.primaryLanguage;
    this.cityList = [];
    const country = this.countryList.find((country) => country.name === this.pais);
    if (country) {
      this.cityList = country.mainCities;
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  //sidebar menu activation end
  hide = true;

  obtenerProvider() {
    this.store.dispatch([new GetProveedorById(Number(this.providerId))]);
    this.store.select(ProviderByIdState.getProveedorById)
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (proveedor) => {
        if (proveedor) {
          this.proveedor = proveedor;
          await this.obtenerUsuario(proveedor.userId);
        }
      });
  }

  async obtenerUsuario(userId: number) {
    if(userId === 0) return;
    this.userId = userId;
    this.store.dispatch([new GetUsuarioById(userId || 0)]);
    this.store.select(UsuarioByIdState.getUsuarioById)
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (usuario) => {
        if (usuario) {
          this.usuario = usuario;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Emite un valor para desuscribirse
    this.destroy$.complete(); // Completa el Subject
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.providerId = params['id'];
      this.obtenerProvider();
    });
    this.store.dispatch([new GetProductosByProvider(Number(this.providerId)), new GetServiciosByProvider(Number(this.providerId)), new GetProveedorById(Number(this.providerId)), new GetResenasByProviderId(Number(this.providerId))]);
    this.servicios$.subscribe((servicios) => {
      this.servicios = servicios;
    });
    this.productos$.subscribe((productos) => {
      this.productos = productos;
    });
    this.usuario$.subscribe((usuario) => {
      this.usuario = usuario;
    });
    this.reviews$.subscribe((reviews) => {
      this.reviews = reviews;
    });
    this.proveedor$.subscribe((proveedor) => {
      this.proveedor = proveedor;
      this.proveedorUpdate.providerId = proveedor.providerId;
      this.proveedorUpdate.name = proveedor.name;
      this.proveedorUpdate.description = proveedor.description;
      this.proveedorUpdate.address = proveedor.address;
      this.proveedorUpdate.rating = proveedor.rating;
      this.proveedorUpdate.status = proveedor.status;
      this.selectedStars = this.proveedor.rating;
      this.asignarFoto(proveedor.imageUrl ?? "");
    });
    this.countryList = countries;
  }

  async asignarFoto(url: string) {
    // date in string
    //const date = new Date().toISOString().replace(/:/g, '-');
    this.utils.urlToFile(url, 'default' + this.userId).then((file) => {
      this.file = file;
    }).catch((error) => {
      console.error('Error converting URL to file:', error);
    });
  }

}
