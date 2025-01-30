import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateMastcotaComponent } from './dialogs/create-mastcota/create-mastcota.component';
import { CreateProductComponent } from './dialogs/create-product/create-product.component';
import { RegistroProveedorComponent } from './dialogs/registro-proveedor/registro-proveedor.component';
import { DeleteConfirmComponent } from './dialogs/delete-confirm/delete-confirm.component';
import { LogoutComponent } from './dialogs/logout/logout.component';
import { CreateServicioComponent } from './dialogs/create-servicio/create-servicio.component';
export interface DialogData {
}
@Injectable({
  providedIn: 'root'
})
export class DialogAccessService {

  constructor(public dialog: MatDialog) {}

  createMascota(): void {
    this.dialog.open(CreateMastcotaComponent, {
    });
  }

  createProduct(): void {
    this.dialog.open(CreateProductComponent, {
    });
  }

  createServicio(): void {
    this.dialog.open(CreateServicioComponent, {
    });
  }

  registroProveedor(): void {
    this.dialog.open(RegistroProveedorComponent, {
    });
  }

  deleteConfirm(): void {
    this.dialog.open(DeleteConfirmComponent, {
    });
  }

  logOut(): void {
    this.dialog.open(LogoutComponent, {
    });
  }
}
