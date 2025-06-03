import { Component, inject, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { TransaccionModel } from 'src/app/inventual/models/producto.model';
import { UpdateTransaccion } from 'src/app/inventual/state-management/transaccion/transaccion.action';
import { TransactionHistoryState } from 'src/app/inventual/state-management/transaccion/transaccion.state';

@Component({
  selector: 'app-actualizar-transaccion',
  templateUrl: './actualizar-transaccion.component.html',
  styleUrls: ['./actualizar-transaccion.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ActualizarTransaccionComponent {
  isLoading$: Observable<boolean> = inject(Store).select(TransactionHistoryState.isLoading);
  transaction: TransaccionModel = {
    transactionHistoryId: 0,
    totalAmount: 0,
    status: '',
    userId: 0,
    amountPerUnit: 0,
    quantity: 0
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: TransaccionModel,
    private router: Router,
    private _snackBar: MatSnackBar,
    private store: Store,
    private dialogRef: MatDialogRef<ActualizarTransaccionComponent>
  ) {
    if (data) {
      this.transaction = { ...data };
      console.log('Transacción a actualizar:', this.transaction);
    }
  }

  ngOnInit(): void {
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  async updateTransaction() {

    this.store.dispatch(new UpdateTransaccion(this.transaction)).subscribe({
      next: () => {
        console.log('Transacción actualizada correctamente:', this.transaction);
        this.openSnackBar('Transacción actualizada correctamente', 'Cerrar');
        this.dialogRef.close();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al actualizar transacción:', error);
        this.openSnackBar('Error al actualizar, vuelve a intentarlo', 'Cerrar');
      },
    });
  }
  
  resetForm() {
    this.transaction = {
      transactionHistoryId: 0,
      totalAmount: 0,
      status: '',
      userId: 0,
      amountPerUnit: 0,
      quantity: 0
    }
  }
}
