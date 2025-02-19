import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ServicioModel, ProductoModel, TransaccionModel } from 'src/app/inventual/models/producto.model';
import { TransactionHistoryState } from 'src/app/inventual/state-management/transaccion/transaccion.state';
import { CarritoService } from '../../carrito.service';
import { DialogAccessService } from '../../dialog-access.service';
import { AddTransaccion } from 'src/app/inventual/state-management/transaccion/transaccion.action';

@Component({
  selector: 'app-comfirmar-agenda',
  templateUrl: './comfirmar-agenda.component.html',
  styleUrls: ['./comfirmar-agenda.component.scss']
})
export class ComfirmarAgendaComponent {
  userId: string = localStorage.getItem('userId') || '';
  isLoading$: Observable<boolean> = inject(Store).select(TransactionHistoryState.isLoading);
  servicios$: Observable<ServicioModel[]>;
  servicios: ServicioModel[] = [];

  productos$: Observable<ProductoModel[]>;
  productos: ProductoModel[] = [];
  transaccionServ: TransaccionModel = {
    totalAmount: 1,
    status: "PENDIENTE",
    userId: 0,
    serviceId: 0,
  }
  transaccionProd: TransaccionModel = {
    totalAmount: 1,
    status: "PENDIENTE",
    userId: 0,
    productId: 0
  }

  constructor(@Inject(MAT_DIALOG_DATA) public servicio: ServicioModel, private dialogRef: MatDialogRef<ComfirmarAgendaComponent>, private router: Router, public store: Store, public carrito: CarritoService, private _snackBar: MatSnackBar, private carritoService: CarritoService, public dialogAccesService: DialogAccessService) {
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
    this.transaccionServ.userId = parseInt(this.userId);
    this.transaccionServ.serviceId = (this.servicio.serviceId ?? 0);
    this.store.dispatch(new AddTransaccion(this.transaccionServ)).subscribe({
      next: () => {
        this.openSnackBar('Transaccion producto registrada correctamente', 'Cerrar');
        this.dialogRef.close();
        this.dialogAccesService.afterAgendar();
      },
      error: (error) => {
        console.error('Error al registrar transaccion producto:', error);
        this.openSnackBar('Error en el registro, vuelve a intentarlo', 'Cerrar');
      },
    });
  }

}
