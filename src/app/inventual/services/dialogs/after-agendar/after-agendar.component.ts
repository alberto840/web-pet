import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { CarritoService } from '../../carrito.service';
import { DialogAccessService } from '../../dialog-access.service';

@Component({
  selector: 'app-after-agendar',
  templateUrl: './after-agendar.component.html',
  styleUrls: ['./after-agendar.component.scss']
})
export class AfterAgendarComponent {

  constructor(private dialogRef: MatDialogRef<AfterAgendarComponent>, private router: Router, public store: Store, public carrito: CarritoService, private _snackBar: MatSnackBar, private carritoService: CarritoService, public dialogAccesService: DialogAccessService) {}
  cerrar() {
    this.dialogRef.close();
  }
}
