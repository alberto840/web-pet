import { Component, inject, OnInit } from '@angular/core';
import { ProveedorState } from '../../state-management/proveedor/proveedor.state';
import { ProveedorModel } from '../../models/proveedor.model';
import { ProviderByIdState } from '../../state-management/proveedor/proveedorById.state';
import { GetProveedorById } from '../../state-management/proveedor/proveedor.action';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
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
import { ProductoState } from '../../state-management/producto/producto.state';
import { ServicioState } from '../../state-management/servicio/servicio.state';

@Component({
  selector: 'app-provider-perfil',
  templateUrl: './provider-perfil.component.html',
  styleUrls: ['./provider-perfil.component.scss']
})
export class ProviderPerfilComponent implements OnInit {
  checked = false;
  selectedStars: number = 0;
  rate(stars: number) {
    this.selectedStars = stars;
  }
  countryList: CountryInfo[] = [];
  cityList: string[] = [];
  pais: string = '';
  ciudad: string = '';
  providerId: string = localStorage.getItem('providerId') || '';
  isLoading$: Observable<boolean> = inject(Store).select(ProviderByIdState.isLoading);
  proveedor$: Observable<ProveedorModel>;
  proveedor: ProveedorModel = {
    name: '',
    description: '',
    address: '',
    userId: 0,
    rating: 0,
    status: false
  };
  userId: string = localStorage.getItem('userId') || '';
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

  constructor(public router: Router, private store: Store, public dialogAccess: DialogAccessService, private _snackBar: MatSnackBar, public utils: UtilsService) {
    this.proveedor$ = this.store.select(ProviderByIdState.getProveedorById);
    this.usuario$ = this.store.select(UsuarioByIdState.getUsuarioById);
    this.servicios$ = this.store.select(ServiceByProviderState.getServiciosByProvider);
    this.productos$ = this.store.select(ProductoByProviderState.getProductosByProvider);
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
    if (this.proveedor.name === '' || this.proveedor.description === '' || this.proveedor.address === '' || this.pais === '' || this.ciudad === '') {
      this.openSnackBar('Por favor, llene todos los campos', 'Cerrar');
      return;
    }

    //this.store.dispatch(new UpdateUsuario(this.usuario, this.file));
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

  ngOnInit(): void {
    this.store.dispatch([new GetProductosByProvider(Number(this.providerId)), new GetServiciosByProvider(Number(this.providerId)), new GetProveedorById(Number(this.providerId)), new GetUsuarioById(Number(this.userId))]);
    this.servicios$.subscribe((servicios) => {
      this.servicios = servicios;
    });
    this.productos$.subscribe((productos) => {
      this.productos = productos;
    });
    this.usuario$.subscribe((usuario) => {
      this.usuario = usuario;
    });
    this.proveedor$.subscribe((proveedor) => {
      this.proveedor = proveedor;
      this.selectedStars = this.proveedor.rating;
    });
    this.countryList = countries;
  }

}
