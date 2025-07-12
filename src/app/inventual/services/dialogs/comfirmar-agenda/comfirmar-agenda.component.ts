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
  constructor(private dialogRef: MatDialogRef<ComfirmarAgendaComponent>, private router: Router, public store: Store, public carrito: CarritoService, private _snackBar: MatSnackBar, private carritoService: CarritoService, public dialogAccesService: DialogAccessService) {}
  cerrar() {
    this.dialogRef.close();
  }
}
