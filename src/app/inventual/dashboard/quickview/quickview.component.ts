import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ProductoState } from '../../state-management/producto/producto.state';
import { ProductoModel, ServicioModel, TransaccionModel } from '../../models/producto.model';
import { GetOfferProductos, GetProducto, GetProductoById } from '../../state-management/producto/producto.action';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DialogAccessService } from '../../services/dialog-access.service';
import { ServicioState } from '../../state-management/servicio/servicio.state';
import { GetOfferServicios, GetServicio, GetServicioById } from '../../state-management/servicio/servicio.action';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProveedorModel } from '../../models/proveedor.model';
import { CarritoService } from '../../services/carrito.service';
import { ProductByIdState } from '../../state-management/producto/productoById.state';
import { GetProveedor } from '../../state-management/proveedor/proveedor.action';
import { ProveedorState } from '../../state-management/proveedor/proveedor.state';
import { ServiceByIdState } from '../../state-management/servicio/servicioById.state';
import { GetTransaccion } from '../../state-management/transaccion/transaccion.action';
import { TransactionHistoryState } from '../../state-management/transaccion/transaccion.state';
import { UtilsService } from '../../utils/utils.service';
import { GetOfertaProducto } from '../../state-management/ofertaProducto/ofertaProducto.action';
import { GetOfertaServicio } from '../../state-management/ofertaServicio/ofertaServicio.action';

@Component({
  selector: 'app-quickview',
  templateUrl: './quickview.component.html',
  styleUrls: ['./quickview.component.scss']
})
export class QuickviewComponent implements OnInit, OnDestroy {
  checked = false;
  checked1 = false;
  userId: string = localStorage.getItem('userId') || '';
  isLoading$: Observable<boolean> = inject(Store).select(ProductoState.isLoading);
  isLoadingServicio$: Observable<boolean> = inject(Store).select(ServicioState.isLoading);
  providers$: Observable<ProveedorModel[]>;
  providers: ProveedorModel[] = [];

  servicios$: Observable<ServicioModel[]>;
  productos$: Observable<ProductoModel[]>;

  servicios: ServicioModel[] = [];
  productos: ProductoModel[] = [];

  private destroy$ = new Subject<void>();

  constructor(public router: Router, private store: Store, public dialogAccess: DialogAccessService, private _snackBar: MatSnackBar, public carritoService: CarritoService, public utils: UtilsService) {
    this.providers$ = this.store.select(ProveedorState.getProveedores);
    this.servicios$ = this.store.select(ServicioState.getOfferServicios);
    this.productos$ = this.store.select(ProductoState.getOfferProductos);
  }
  ngOnInit(): void {
    this.store.dispatch([new GetOfferProductos ,new GetOfferServicios(), new GetProveedor()]);
    this.productos$.pipe(takeUntil(this.destroy$)).subscribe((productos) => {
      this.productos = productos;
    });
    this.servicios$.pipe(takeUntil(this.destroy$)).subscribe((servicios) => {
      this.servicios = servicios;
    });
    this.providers$.subscribe((providers) => {
      this.providers = providers;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Emite un valor para desuscribirse
    this.destroy$.complete(); // Completa el Subject
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

}
