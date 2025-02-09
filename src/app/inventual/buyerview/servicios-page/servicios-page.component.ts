import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ServicioState } from '../../state-management/servicio/servicio.state';
import { ServicioModel } from '../../models/producto.model';
import { GetServicio } from '../../state-management/servicio/servicio.action';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { combineLatest, map, Observable } from 'rxjs';
import { UtilsService } from '../../utils/utils.service';
import { ProveedorModel } from '../../models/proveedor.model';
import { ProveedorState } from '../../state-management/proveedor/proveedor.state';
import { GetProveedor } from '../../state-management/proveedor/proveedor.action';
import { countries, CountryInfo } from '../../utils/paises_data';
import { fadeInOut, INavbarData } from '../../dashboard/menu/helper';
import { trigger, transition, animate, keyframes, style } from '@angular/animations';
import { CategoriaModel, mapCategoriesToNavbar, SubCategoriaModel, SubSubCategoriaModel } from '../../models/categoria.model';
import { CategoriaState } from '../../state-management/categoria/categoria.state';
import { SubcategoriaState } from '../../state-management/subcategoria/subcategoria.state';
import { SubsubcategoriaState } from '../../state-management/subsubcategoria/subsubcategoria.state';
import { getCategorias } from '../../state-management/categoria/categoria.action';
import { GetSubcategoria } from '../../state-management/subcategoria/subcategoria.action';
import { GetSubsubcategoria } from '../../state-management/subsubcategoria/subsubcategoria.action';
import { UsuarioState } from '../../state-management/usuario/usuario.state';
import { UsuarioModel } from '../../models/usuario.model';

@Component({
  selector: 'app-servicios-page',
  templateUrl: './servicios-page.component.html',
  styleUrls: ['./servicios-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    fadeInOut,
    trigger('rotate', [
      transition(':enter', [
        animate(
          '1000ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(2turn)', offset: '1' }),
          ])
        ),
      ]),
    ]),
  ],
})
export class ServiciosPageComponent implements OnInit {
  panelOpenState = false;
  isLoadingCategory$: Observable<boolean> = inject(Store).select(CategoriaState.isLoading);
  subCatIsLoading$: Observable<boolean> = inject(Store).select(SubcategoriaState.isLoading);
  subSubCatIsLoading$: Observable<boolean> = inject(Store).select(SubsubcategoriaState.isLoading);
  categorias$: Observable<CategoriaModel[]>;
  subcategorias$: Observable<SubCategoriaModel[]>;
  subsubcategorias$: Observable<SubSubCategoriaModel[]>;
  categories: CategoriaModel[] = [];
  subcategories: SubCategoriaModel[] = [];
  subsubcategories: SubSubCategoriaModel[] = [];
  navData: INavbarData[] = [];
  multiple: boolean = false;

  max = 1000;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value = 0;

  countryList: CountryInfo[] = [];
  cityList: string[] = [];
  pais: string = '';
  ciudad: string = '';
  isLoading$: Observable<boolean> = inject(Store).select(ServicioState.isLoading);
  servicios: ServicioModel[] = [];
  servicios$: Observable<ServicioModel[]>;
  serviciosListFiltrado: ServicioModel[] = [];

  providers$: Observable<ProveedorModel[]>;
  providers: ProveedorModel[] = [];

  usuarios$: Observable<UsuarioModel[]>;
  usuarios: UsuarioModel[] = [];

  menuSidebarActive: boolean = false;
  constructor(public router: Router, private store: Store, public utils: UtilsService) {
    this.servicios$ = this.store.select(ServicioState.getServicios);
    this.providers$ = this.store.select(ProveedorState.getProveedores);
    this.usuarios$ = this.store.select(UsuarioState.getUsuarios);

    this.categorias$ = this.store.select(CategoriaState.getCategorias);
    this.subcategorias$ = this.store.select(SubcategoriaState.getSubcategorias);
    this.subsubcategorias$ = this.store.select(SubsubcategoriaState.getSubsubcategorias);
  }
  ngOnInit(): void {
    this.countryList = countries;
    this.store.dispatch([new GetServicio(), new GetProveedor(), new getCategorias(), new GetSubcategoria(), new GetSubsubcategoria()]);

    this.servicios$.subscribe((servicios) => {
      this.servicios = servicios;
      this.serviciosListFiltrado = servicios;
    });
    this.providers$.subscribe((providers) => {
      this.providers = providers;
    });
    this.usuarios$.subscribe((usuarios) => {
      this.usuarios = usuarios;
    });
    combineLatest([this.categorias$, this.subcategorias$, this.subsubcategorias$])
      .pipe(
        map(([categorias, subcategorias, subsubcategorias]) => {
          this.categories = categorias;
          this.subcategories = subcategorias;
          this.subsubcategories = subsubcategorias;
          return mapCategoriesToNavbar(categorias, subcategorias, subsubcategorias);
        })
      )
      .subscribe((navData) => {
        this.navData = navData;
      });
  }

  public ciudadesDelPais(pais: CountryInfo) {
    this.cityList = [];
    const country = this.countryList.find((country) => country.name === this.pais);
    if (country) {
      this.cityList = country.mainCities;
    }
  }
  myfunction() {
    if (this.menuSidebarActive == false) {
      this.menuSidebarActive = true;
    }
    else {
      this.menuSidebarActive = false;
    }
  }

  handleClick(item: INavbarData): void {
    this.shrinkItems(item);
    item.expanded = !item.expanded;
  }

  getActiveClass(data: INavbarData): string {
    return this.router.url.includes(data.routeLink) ? 'active' : '';
  }

  // Método para aplicar los filtros
  aplicarFiltros() {
    this.serviciosListFiltrado = this.servicios.filter(servicio => {
      const cumplePrecio = servicio.price >= this.min && servicio.price <= this.value;
      const location = this.utils.getUsuarioLocationByServiceId(this.providers, this.usuarios, servicio.providerId);
      const cumpleLocation = this.pais+', '+this.ciudad === location;

      return cumplePrecio || cumpleLocation;
    });
  }

  sortByLowerPrice() {
    this.serviciosListFiltrado = this.serviciosListFiltrado.sort((a, b) => a.price - b.price);
  }

  sortByHigherPrice() {
    this.serviciosListFiltrado = this.serviciosListFiltrado.sort((a, b) => b.price - a.price);
  }

  sortByName() {
    this.serviciosListFiltrado = this.serviciosListFiltrado.sort((a, b) => a.serviceName.localeCompare(b.serviceName));
  }

  sortByNameDescendent() {
    this.serviciosListFiltrado = this.serviciosListFiltrado.sort((a, b) => b.serviceName.localeCompare(a.serviceName));
  }

  sortByRatingHigher() {
    //this.serviciosListFiltrado = this.serviciosListFiltrado.sort((a, b) => b.rating - a.rating);
  }

  shrinkItems(item: INavbarData): void {
    if (!this.multiple) {
      for (let modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
  }

}
