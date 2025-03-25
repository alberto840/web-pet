import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { UtilsService } from '../../utils/utils.service';
import { GetProductoById } from '../../state-management/producto/producto.action';
import { ProductByIdState } from '../../state-management/producto/productoById.state';
import { Observable, observable, Subject, takeUntil } from 'rxjs';
import { ProductoModel } from '../../models/producto.model';
import { GetProveedor, GetProveedorById } from '../../state-management/proveedor/proveedor.action';
import { ProviderByIdState } from '../../state-management/proveedor/proveedorById.state';
import { ProveedorModel } from '../../models/proveedor.model';
import { CategoriaModel } from '../../models/categoria.model';
import { getCategorias } from '../../state-management/categoria/categoria.action';
import { CategoriaState } from '../../state-management/categoria/categoria.state';

@Component({
  selector: 'app-producto-detalle',
  templateUrl: './producto-detalle.component.html',
  styleUrls: ['./producto-detalle.component.scss']
})
export class ProductoDetalleComponent implements OnInit, OnDestroy {
  productoId: number = 0;
  private destroy$ = new Subject<void>();
  producto: ProductoModel = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    status: false,
    providerId: 0,
    categoryId: 0,
    isOnSale: false,
  }
  proveedor: ProveedorModel = {
    name: '',
    description: '',
    address: '',
    userId: 0,
    rating: 0,
    status: false
  }
  categoria: CategoriaModel = {
    nameCategory: '',
    icono: ''
  }
  categorias$: Observable<CategoriaModel[]>;
  categorias: CategoriaModel[] = [];

  constructor(private route: ActivatedRoute, public router: Router, private store: Store, public utils: UtilsService) {
    this.categorias$ = this.store.select(CategoriaState.getCategorias);
   }
  ngOnInit(): void {
    this.store.dispatch([new getCategorias()]);
    this.categorias$.pipe(takeUntil(this.destroy$)).subscribe((categorias) => {
      this.categorias = categorias;
    });
    this.route.params.subscribe(params => {
      this.productoId = params['id'];
      this.obtenerProducto();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Emite un valor para desuscribirse
    this.destroy$.complete(); // Completa el Subject
  }

  obtenerProducto() {
    this.store.dispatch([new GetProductoById(this.productoId)]);
    this.store.select(ProductByIdState.getProductById)
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (producto) => {
        if (producto) {
          this.producto = producto;
          await this.obtenerProvider();
        }
      });
  }

  async obtenerProvider(){    
    this.store.dispatch([new GetProveedorById(this.producto.providerId)]);
    this.store.select(ProviderByIdState.getProveedorById)
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (proveedor) => {
        if (proveedor) {
          this.proveedor = proveedor;
        }
      });
  }

  menuSidebarActive: boolean = false;
  myfunction() {
    if (this.menuSidebarActive == false) {
      this.menuSidebarActive = true;
    }
    else {
      this.menuSidebarActive = false;
    }
  }
}
