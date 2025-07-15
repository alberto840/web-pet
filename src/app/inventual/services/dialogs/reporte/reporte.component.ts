import { Component, Inject, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { TicketModel } from 'src/app/inventual/models/ticket.model';
import { AddTicket } from 'src/app/inventual/state-management/ticket/ticket.action';
import { SupportTicketState } from 'src/app/inventual/state-management/ticket/ticket.state';
import { ConvertirRutaAImagenService } from 'src/app/inventual/utils/convertir-ruta-aimagen.service';
import { CreateMastcotaComponent } from '../create-mastcota/create-mastcota.component';
import { ReservacionModel, TransaccionModel } from 'src/app/inventual/models/producto.model';
import { UpdateReserva } from 'src/app/inventual/state-management/reserva/reserva.action';
import { UpdateTransaccion } from 'src/app/inventual/state-management/transaccion/transaccion.action';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss']
})
export class ReporteComponent implements OnInit {
  userId: string = localStorage.getItem('userId') || '';
  isLoading$: Observable<boolean> = inject(Store).select(SupportTicketState.isLoading);
  ticket: TicketModel = {
    supportTicketsId: 0,
    subject: '',
    description: '',
    status: 'Nuevo',
    userId: 0
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: { providerId: number, transaccion?: TransaccionModel, reserva?: ReservacionModel }, private utils: ConvertirRutaAImagenService, private router: Router, private _snackBar: MatSnackBar, private store: Store, private dialogRef: MatDialogRef<CreateMastcotaComponent>) {

  }
  ngOnInit(): void {
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  async registrarTicket() {
    this.ticket.userId = parseInt(this.userId);
    if (this.ticket.subject === '' || this.ticket.description === '') {
      this.openSnackBar('Debe llenar todos los campos', 'Cerrar');
      return;
    }
    // Enviar usuario y archivo al store
    this.store.dispatch(new AddTicket(this.ticket)).subscribe({
      next: () => {
        console.log('Ticket registrada correctamente:', this.ticket);
        this.openSnackBar('Ticket registrada correctamente', 'Cerrar');
        if (!this.data.transaccion || this.data.transaccion == undefined) {
          this.actualizarReserva();
        } else {
          if (!this.data.reserva || this.data.reserva == undefined) {
            this.actualizarTransaccion();
          }
        }
        this.dialogRef.close();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al registrar ticket:', error);
        this.openSnackBar('Error en el registro, vuelve a intentarlo', 'Cerrar');
      },
    });
  }

  actualizarTransaccion() {
    if (!this.data.transaccion || this.data.transaccion == undefined) {
      console.error('No hay transacción para actualizar');
      this.openSnackBar('No hay transacción para actualizar', 'Cerrar');
      return;
    }
    this.data.transaccion.status = 'cancelado';
    this.store.dispatch(new UpdateTransaccion(this.data.transaccion)).subscribe({
      next: () => {
        console.log('transaccion actualizada correctamente:', this.data.transaccion);
        this.openSnackBar('transaccion actualizada correctamente', 'Cerrar');
        this.dialogRef.close();
        this.router.navigate(['/historialcompra']);
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al actualizada transaccion:', error);
        this.openSnackBar('Error en el actualizar, vuelve a intentarlo', 'Cerrar');
      },
    });
  }

  actualizarReserva() {
    if (!this.data.reserva || this.data.reserva == undefined) {
      console.error('No hay transacción para actualizar');
      this.openSnackBar('No hay transacción para actualizar', 'Cerrar');
      return;
    }
    this.data.reserva.status = 'CANCELADO';
    this.store.dispatch(new UpdateReserva(this.data.reserva)).subscribe({
      next: () => {
        console.log('Reserva actualizada correctamente:', this.data.reserva);
        this.openSnackBar('Reserva actualizada correctamente', 'Cerrar');
        this.dialogRef.close();
        this.router.navigate(['/user/agenda']);
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al actualizar reserva:', error);
        this.openSnackBar('Error al actualizar, vuelve a intentarlo', 'Cerrar');
      },
    });
  }

  // Reiniciar formulario
  resetForm() {
    this.ticket = {
      supportTicketsId: 0,
      subject: '',
      description: '',
      status: 'nuevo',
      userId: 0
    }
  }

}
