import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CodigoDescuentoModel, CodigoDescuentoModelString } from 'src/app/inventual/models/producto.model';
import { ProveedorModel } from 'src/app/inventual/models/proveedor.model';
import { UpdateCodigoDescuento } from 'src/app/inventual/state-management/codigoDescuento/codigoDescuento.action';
import { CodigoDescuentoState } from 'src/app/inventual/state-management/codigoDescuento/codigoDescuento.state';
import { GetProveedor } from 'src/app/inventual/state-management/proveedor/proveedor.action';
import { ProveedorState } from 'src/app/inventual/state-management/proveedor/proveedor.state';

@Component({
  selector: 'app-actualizar-codigo-promo',
  templateUrl: './actualizar-codigo-promo.component.html',
  styleUrls: ['./actualizar-codigo-promo.component.scss']
})
export class ActualizarCodigoPromoComponent implements OnInit {
  isLoading$: Observable<boolean> = inject(Store).select(CodigoDescuentoState.isLoading);
  filteredProveedor!: Observable<ProveedorModel[]>;
  myControlProveedores = new FormControl('');

  displayFnProveedor(proveedor: ProveedorModel): any {
    return proveedor && proveedor.name ? proveedor.name : "";
  }

  selectProveedor(proveedor: ProveedorModel) {
    this.codigoDescuento.providerId = (proveedor.providerId ?? 0);
  }
  codigoDescuento: CodigoDescuentoModel = {
    code: '',
    description: '',
    discountType: '',
    discountValue: 0,
    maxUses: 0,
    startDate: new Date(),
    endDate: new Date(),
    active: true,
    providerId: 0,
  };
  providers$: Observable<ProveedorModel[]>;
  providers: ProveedorModel[]= [];

  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<ActualizarCodigoPromoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CodigoDescuentoModel,
    private _snackBar: MatSnackBar
  ) {
    if (data) {
      this.codigoDescuento = { ...data };
    }
    this.providers$ = this.store.select(ProveedorState.getProveedores);
  }

  ngOnInit(): void {
    this.store.dispatch(new GetProveedor());
    this.providers$.subscribe({
      next: (data) => {
        this.providers = data;
      },
      error: (error) => {
        console.error('Error al obtener proveedores:', error);
      }
    });
    this.codigoDescuento = { ...this.data };
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  actualizarCodigoDescuento() {
    this.store.dispatch(new UpdateCodigoDescuento(this.codigoDescuento)).subscribe({
      next: () => {
        this.openSnackBar('Código de descuento actualizado correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al actualizar código de descuento:', error);
        this.openSnackBar('Error al actualizar código de descuento', 'Cerrar');
      },
    });
    this.cerrarDialog();
  }

  cerrarDialog() {
    this.dialogRef.close();
  }

}
