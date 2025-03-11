import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ServicioState } from '../../state-management/servicio/servicio.state';
import { ServicioModel } from '../../models/producto.model';
import { GetServicio } from '../../state-management/servicio/servicio.action';
import { ActivatedRoute, Router } from '@angular/router';
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
import { GetUsuario } from '../../state-management/usuario/usuario.action';

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
  categoryUrl: number = 0;
  categoriasSeleccionadas: string[] = [];

  domicilio: boolean = true;
  local: boolean = true;
  ambos: boolean = true;

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
  constructor(private route: ActivatedRoute, public router: Router, private store: Store, public utils: UtilsService) {
    this.servicios$ = this.store.select(ServicioState.getServicios);
    this.providers$ = this.store.select(ProveedorState.getProveedores);
    this.usuarios$ = this.store.select(UsuarioState.getUsuarios);

    this.categorias$ = this.store.select(CategoriaState.getCategorias);
    this.subcategorias$ = this.store.select(SubcategoriaState.getSubcategorias);
    this.subsubcategorias$ = this.store.select(SubsubcategoriaState.getSubsubcategorias);
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryUrl = params['id'];
    });
    this.countryList = countries;
    this.store.dispatch([new GetUsuario(), new GetServicio(), new GetProveedor(), new getCategorias(), new GetSubcategoria(), new GetSubsubcategoria()]);

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
      // 1. Filtrar por precio
      const cumplePrecio = servicio.price >= this.min && servicio.price <= this.value;
  
      // 2. Obtener la ubicación del servicio
      const location = this.utils.getUsuarioLocationByServiceId(this.providers, this.usuarios, servicio.providerId);
  
      // 3. Filtrar por tipo de servicio
      const tipoAtencion = servicio.tipoAtencion.toLowerCase();
      const cumpleTipoServicio = tipoAtencion === 'domicilio' 
        ? this.domicilio 
        : tipoAtencion === 'local' 
          ? this.local 
          : this.ambos;
  
      // 4. Filtrar por ubicación (país y ciudad)
      let cumpleLocation = true; // Por defecto, no se filtra por ubicación
      if (this.pais && this.ciudad) {
        cumpleLocation = `${this.pais}, ${this.ciudad}` === location;
      }

      // 5. Filtrar por categoría

  
      // 6. Aplicar todos los filtros
      return cumplePrecio && cumpleTipoServicio && cumpleLocation;
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
  
  ordenarPorCalificacion: boolean = false;
  ordenarServiciosPorCalificacion() {
    if (this.ordenarPorCalificacion) {
      // Ordenar de mayor a menor calificación
      this.serviciosListFiltrado.sort((a, b) => {
        const proveedorA = this.providers.find(p => p.providerId === a.providerId);
        const proveedorB = this.providers.find(p => p.providerId === b.providerId);
        return (proveedorB?.rating || 0) - (proveedorA?.rating || 0);
      });
    } else {
      // Restaurar la lista original
      this.serviciosListFiltrado = [...this.servicios];
    }
  }

  selectAll(){
    this.local = this.domicilio;
    this.ambos = this.domicilio;
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
  
  selectedCategories: Set<number> = new Set(); // Almacena los IDs de las categorías seleccionadas
  selectAllCategories: boolean = false; // Estado del checkbox "Todas las categorías"

  // Método para manejar el cambio en el checkbox "Todas las categorías"
  toggleAllCategories(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectAllCategories = isChecked;

    if (isChecked) {
      // Selecciona todas las categorías
      this.selectedCategories = new Set(this.navData.map(category => category.id ?? 0));
    } else {
      // Deselecciona todas las categorías
      this.selectedCategories.clear();
    }
  }

  // Método para manejar el cambio en un checkbox de categoría
  toggleCategory(categoryId: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedCategories.add(categoryId);
    } else {
      this.selectedCategories.delete(categoryId);
    }

    // Si se deselecciona una categoría, desmarcar "Todas las categorías"
    if (this.selectAllCategories && !isChecked) {
      this.selectAllCategories = false;
    }
  }

  // Método para verificar si una categoría está seleccionada
  isCategoryChecked(categoryId: number): boolean {
    return this.selectedCategories.has(categoryId) || this.selectAllCategories;
  }

  // Método para filtrar las categorías seleccionadas
  filterByCategories() {
    if (this.selectAllCategories) {
      // Mostrar todas las categorías
      return this.navData;
    } else {
      // Filtrar por categorías seleccionadas
      return this.navData.filter(category => this.selectedCategories.has(category.id ?? 0));
    }
  }

}
