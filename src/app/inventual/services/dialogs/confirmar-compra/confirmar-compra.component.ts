import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ProductoModel, ServicioModel, TransaccionModel } from 'src/app/inventual/models/producto.model';
import { TransactionHistoryState } from 'src/app/inventual/state-management/transaccion/transaccion.state';
import { CarritoService } from '../../carrito.service';
import { AddTransaccion } from 'src/app/inventual/state-management/transaccion/transaccion.action';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogAccessService } from '../../dialog-access.service';

@Component({
  selector: 'app-confirmar-compra',
  templateUrl: './confirmar-compra.component.html',
  styleUrls: ['./confirmar-compra.component.scss']
})
export class ConfirmarCompraComponent {
  userId: string = localStorage.getItem('userId') || '';
  isLoading$: Observable<boolean> = inject(Store).select(TransactionHistoryState.isLoading);
  servicios$: Observable<ServicioModel[]>;
  servicios: ServicioModel[] = [];

  productos$: Observable<ProductoModel[]>;
  productos: ProductoModel[] = [];
  transaccion: TransaccionModel = {
    totalAmount: 0,
    status: "pendiente",
    userId: 0,
    serviceId: 0,
    productId: 0
  }

  constructor(private dialogRef: MatDialogRef<ConfirmarCompraComponent>, private router: Router, public store: Store, public carrito: CarritoService, private _snackBar: MatSnackBar, private carritoService: CarritoService, public dialogAccesService: DialogAccessService) {
    this.servicios$ = this.store.select(state => state.carrito.servicios);
    this.productos$ = this.store.select(state => state.carrito.productos);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  ngOnInit(): void {
    this.store.dispatch([]);
    this.servicios$.subscribe((servicios) => {
      this.servicios = servicios;
    });
    this.productos$.subscribe((productos) => {
      this.productos = productos;
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

  async registrarTransaccion() {
    //if (this.servicios.length === 0 && this.productos.length === 0) {
    //  this.openSnackBar('No hay productos ni servicios en el carrito', 'Cerrar');
    //  return;
    //}
    //this.recorrerProductos(this.productos);
    //this.recorrerServicios(this.servicios);
    this.dialogRef.close();
    this.dialogAccesService.afterCompra();
    //this.carritoService.vaciarCarrito();
  }

  recorrerProductos(productos: ProductoModel[]) {
    this.transaccion.userId = this.userId ? parseInt(this.userId) : 0;
    productos.forEach((producto) => {
      this.transaccion.productId = producto.productId ?? 1;
      this.transaccion.totalAmount = producto.cantidad ?? 1;
      for (let i = 0; i < (producto.cantidad ?? 1); i++) {
        this.store.dispatch(new AddTransaccion(this.transaccion)).subscribe({
          next: () => {
            this.openSnackBar('Transaccion producto registrada correctamente', 'Cerrar');
          },
          error: (error) => {
            console.error('Error al registrar transaccion producto:', error);
            this.openSnackBar('Error en el registro, vuelve a intentarlo', 'Cerrar');
          },
        });
      }
    });
  }

  recorrerServicios(servicios: ServicioModel[]) {
    this.transaccion.userId = this.userId ? parseInt(this.userId) : 0;
    servicios.forEach((servicios) => {
      this.transaccion.serviceId = servicios.serviceId ?? 1;
      this.transaccion.totalAmount = servicios.cantidad ?? 1;
      for (let i = 0; i < (servicios.cantidad ?? 1); i++) {
        this.store.dispatch(new AddTransaccion(this.transaccion)).subscribe({
          next: () => {
            this.openSnackBar('Transaccion servicio registrada correctamente', 'Cerrar');
          },
          error: (error) => {
            console.error('Error al registrar transaccion servicio:', error);
            this.openSnackBar('Error en el registro, vuelve a intentarlo', 'Cerrar');
          },
        });
      }
    });
  }


}
