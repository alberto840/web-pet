import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { TransaccionModel } from '../../models/producto.model';
import { CarritoService } from '../../services/carrito.service';
import { DialogAccessService } from '../../services/dialog-access.service';
import { GetTransaccionByUser } from '../../state-management/transaccion/transaccion.action';
import { UtilsService } from '../../utils/utils.service';
import { GetProveedor } from '../../state-management/proveedor/proveedor.action';
import { TransaccionByUserState } from '../../state-management/transaccion/transaccionByUser.state';

@Component({
  selector: 'app-historial-compra',
  templateUrl: './historial-compra.component.html',
  styleUrls: ['./historial-compra.component.scss']
})
export class HistorialCompraComponent implements OnInit, OnDestroy {
  userId: string = localStorage.getItem('userId') || '';
  isLoading$: Observable<boolean> = inject(Store).select(TransaccionByUserState.isLoading);
  transacciones$: Observable<TransaccionModel[]>;

  private destroy$ = new Subject<void>();

  constructor(public router: Router, private store: Store, public dialogAccess: DialogAccessService, private _snackBar: MatSnackBar, public carritoService: CarritoService, public utils: UtilsService) {

    this.transacciones$ = this.store.select(TransaccionByUserState.getTransaccionesByUser).pipe(
      map(transacciones => [...transacciones].reverse()) // Create a copy and reverse it
    );
  }
  ngOnInit(): void {
    this.store.dispatch([new GetTransaccionByUser(Number(this.userId))]);
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
