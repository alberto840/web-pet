import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ProductoModel, ServicioModel, TransaccionModel } from '../../models/producto.model';
import { CarritoService } from '../../services/carrito.service';
import { DialogAccessService } from '../../services/dialog-access.service';
import { GetTransaccion, GetTransaccionByUser } from '../../state-management/transaccion/transaccion.action';
import { TransactionHistoryState } from '../../state-management/transaccion/transaccion.state';
import { UtilsService } from '../../utils/utils.service';
import { GetServicioById } from '../../state-management/servicio/servicio.action';
import { GetProductoById } from '../../state-management/producto/producto.action';
import { ServiceByIdState } from '../../state-management/servicio/servicioById.state';
import { ProductByIdState } from '../../state-management/producto/productoById.state';
import { ProveedorModel } from '../../models/proveedor.model';
import { ProveedorState } from '../../state-management/proveedor/proveedor.state';
import { GetProveedor } from '../../state-management/proveedor/proveedor.action';
import { TransaccionByUserState } from '../../state-management/transaccion/transaccionByUser.state';

@Component({
  selector: 'app-historial-compra',
  templateUrl: './historial-compra.component.html',
  styleUrls: ['./historial-compra.component.scss']
})
export class HistorialCompraComponent implements OnInit, OnDestroy {
  serviciosMap: Map<number, ServicioModel> = new Map();
  productosMap: Map<number, ProductoModel> = new Map();
  userId: string = localStorage.getItem('userId') || '';
  isLoading$: Observable<boolean> = inject(Store).select(TransaccionByUserState.isLoading);
  transacciones$: Observable<TransaccionModel[]>;
  transaccionesPendientes: TransaccionModel[] = [];
  transaccionesCanceladas: TransaccionModel[] = [];
  transaccionesAtendidas: TransaccionModel[] = [];
  providers$: Observable<ProveedorModel[]>;
  providers: ProveedorModel[] = [];

  private destroy$ = new Subject<void>();

  constructor(public router: Router, private store: Store, public dialogAccess: DialogAccessService, private _snackBar: MatSnackBar, public carritoService: CarritoService, public utils: UtilsService) {
    this.transacciones$ = this.store.select(TransaccionByUserState.getTransaccionesByUser);
    this.providers$ = this.store.select(ProveedorState.getProveedores);
  }
  ngOnInit(): void {
    this.store.dispatch([new GetTransaccionByUser(Number(this.userId)), new GetProveedor()]);
    this.transacciones$
      .pipe(takeUntil(this.destroy$))
      .subscribe((transacciones) => {
        this.transaccionesPendientes = transacciones.filter(
          (transaccion) => transaccion.status.toLowerCase() === 'pendiente'
        ).reverse();
        this.transaccionesAtendidas = transacciones.filter(
          (transaccion) => transaccion.status.toLowerCase() === 'atendido'
        ).reverse();
        this.transaccionesCanceladas = transacciones.filter(
          (transaccion) => transaccion.status.toLowerCase() === 'cancelado'
        ).reverse();

        // Obtener servicios y productos para cada transacción
        transacciones.forEach((transaccion) => {
          if (transaccion.serviceId) {
            this.store.dispatch([new GetServicioById(transaccion.serviceId)]);
          }
          if (transaccion.productId) {
            this.store.dispatch([new GetProductoById(transaccion.productId)]);
          }
        });

        // Escuchar cambios en los servicios y productos
        this.store.select(ServiceByIdState.getServiceById)
          .pipe(takeUntil(this.destroy$))
          .subscribe((servicio) => {
            if (servicio) {
              this.serviciosMap.set((servicio.serviceId ?? 0), servicio);
            }
          });

        this.store.select(ProductByIdState.getProductById)
          .pipe(takeUntil(this.destroy$))
          .subscribe((producto) => {
            if (producto) {
              this.productosMap.set((producto.productId ?? 0), producto);
            }
          });
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
