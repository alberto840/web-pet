import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ProductoModel } from '../../models/producto.model';
import { combineLatest, map, Observable } from 'rxjs';
import { ProductoState } from '../../state-management/producto/producto.state';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { GetProducto } from '../../state-management/producto/producto.action';
import { fadeInOut, INavbarData } from '../../dashboard/menu/helper';
import { CategoriaModel, SubCategoriaModel, SubSubCategoriaModel, mapCategoriesToNavbar } from '../../models/categoria.model';
import { ProveedorModel } from '../../models/proveedor.model';
import { UsuarioModel } from '../../models/usuario.model';
import { getCategorias } from '../../state-management/categoria/categoria.action';
import { CategoriaState } from '../../state-management/categoria/categoria.state';
import { GetProveedor } from '../../state-management/proveedor/proveedor.action';
import { ProveedorState } from '../../state-management/proveedor/proveedor.state';
import { GetSubcategoria } from '../../state-management/subcategoria/subcategoria.action';
import { SubcategoriaState } from '../../state-management/subcategoria/subcategoria.state';
import { GetSubsubcategoria } from '../../state-management/subsubcategoria/subsubcategoria.action';
import { SubsubcategoriaState } from '../../state-management/subsubcategoria/subsubcategoria.state';
import { UsuarioState } from '../../state-management/usuario/usuario.state';
import { CountryInfo, countries } from '../../utils/paises_data';
import { UtilsService } from '../../utils/utils.service';
import { trigger, transition, animate, keyframes, style } from '@angular/animations';
import { GetUsuario } from '../../state-management/usuario/usuario.action';

@Component({
  selector: 'app-productos-page',
  templateUrl: './productos-page.component.html',
  styleUrls: ['./productos-page.component.scss'],
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
export class ProductosPageComponent implements OnInit {
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

  max: number = 1000;
  min: number = 0;
  showTicks = false;
  step: number = 1;
  thumbLabel = false;
  value: number = 0;

  countryList: CountryInfo[] = [];
  cityList: string[] = [];
  pais: string = '';
  ciudad: string = '';
  isLoading$: Observable<boolean> = inject(Store).select(ProductoState.isLoading);
  productos: ProductoModel[] = [];
  productos$: Observable<ProductoModel[]>;
  productosListFiltrado: ProductoModel[] = [];

  providers$: Observable<ProveedorModel[]>;
  providers: ProveedorModel[] = [];

  usuarios$: Observable<UsuarioModel[]>;
  usuarios: UsuarioModel[] = [];

  menuSidebarActive: boolean = false;
  constructor(public router: Router, private store: Store, public utils: UtilsService) {
    this.productos$ = this.store.select(ProductoState.getProductos);
    this.providers$ = this.store.select(ProveedorState.getProveedores);
    this.usuarios$ = this.store.select(UsuarioState.getUsuarios);

    this.categorias$ = this.store.select(CategoriaState.getCategorias);
    this.subcategorias$ = this.store.select(SubcategoriaState.getSubcategorias);
    this.subsubcategorias$ = this.store.select(SubsubcategoriaState.getSubsubcategorias);
  }
  ngOnInit(): void {
    this.countryList = countries;
    this.store.dispatch([new GetUsuario(), new GetProducto(), new GetProveedor(), new getCategorias(), new GetSubcategoria(), new GetSubsubcategoria()]);

    this.productos$.subscribe((productos) => {
      this.productos = productos;
      this.productosListFiltrado = productos;
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

  selectAll(){
    this.local = this.domicilio;
    this.ambos = this.domicilio;
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
    this.productosListFiltrado = this.productos.filter(productos => {
      const cumplePrecio = productos.price >= this.min && productos.price <= this.value;
      const location = this.utils.getUsuarioLocationByProductId(this.providers, this.usuarios, productos.providerId);
      
      if(this.pais === '' || this.ciudad === '') {
        return cumplePrecio;
      }else{
        const cumpleLocation = this.pais+', '+this.ciudad === location;
        return cumplePrecio && cumpleLocation;
      }
    });
  }

  sortByLowerPrice() {
    this.productosListFiltrado = this.productosListFiltrado.sort((a, b) => a.price - b.price);
  }

  sortByHigherPrice() {
    this.productosListFiltrado = this.productosListFiltrado.sort((a, b) => b.price - a.price);
  }

  sortByName() {
    this.productosListFiltrado = this.productosListFiltrado.sort((a, b) => a.name.localeCompare(b.name));
  }

  sortByNameDescendent() {
    this.productosListFiltrado = this.productosListFiltrado.sort((a, b) => b.name.localeCompare(a.name));
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