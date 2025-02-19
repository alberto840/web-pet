import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { CarritoService } from '../../carrito.service';
import { DialogAccessService } from '../../dialog-access.service';
import { ConfirmarCompraComponent } from '../confirmar-compra/confirmar-compra.component';

@Component({
  selector: 'app-after-compra',
  templateUrl: './after-compra.component.html',
  styleUrls: ['./after-compra.component.scss']
})
export class AfterCompraComponent {
  constructor(private dialogRef: MatDialogRef<AfterCompraComponent>, private router: Router, public store: Store, public carrito: CarritoService, private _snackBar: MatSnackBar, private carritoService: CarritoService, public dialogAccesService: DialogAccessService) {}
  cerrar() {
    this.dialogRef.close();
  }
}
