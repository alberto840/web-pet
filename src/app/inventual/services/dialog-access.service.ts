import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateMastcotaComponent } from './dialogs/create-mastcota/create-mastcota.component';
import { CreateProductComponent } from './dialogs/create-product/create-product.component';
import { RegistroProveedorComponent } from './dialogs/registro-proveedor/registro-proveedor.component';
import { DeleteConfirmComponent } from './dialogs/delete-confirm/delete-confirm.component';
import { LogoutComponent } from './dialogs/logout/logout.component';
import { CreateServicioComponent } from './dialogs/create-servicio/create-servicio.component';
import { ConfirmarCompraComponent } from './dialogs/confirmar-compra/confirmar-compra.component';
import { AfterCompraComponent } from './dialogs/after-compra/after-compra.component';
import { ReporteComponent } from './dialogs/reporte/reporte.component';
import { CalificacionComponent } from './dialogs/calificacion/calificacion.component';
import { ServicioModel, TransaccionModel } from '../models/producto.model';
import { AgendarComponent } from './dialogs/agendar/agendar.component';
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

  confirmarCompra(): void {
    this.dialog.open(ConfirmarCompraComponent, {
    });
  }

  afterCompra(): void {
    this.dialog.open(AfterCompraComponent, {
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

  crearTicket(): void {
    this.dialog.open(ReporteComponent, {
    });
  }

  crearReview(providerId: number, transaccion: TransaccionModel): void {
    this.dialog.open(CalificacionComponent, {
      data: {providerId, transaccion},
    });
  }

  agendar(servicio: ServicioModel): void {
    this.dialog.open(AgendarComponent, {
      data: servicio,
    });
  }
}
