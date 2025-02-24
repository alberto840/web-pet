import { Component, Inject, inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { TicketModel } from 'src/app/inventual/models/ticket.model';
import { AddTicket, UpdateTicket } from 'src/app/inventual/state-management/ticket/ticket.action';
import { SupportTicketState } from 'src/app/inventual/state-management/ticket/ticket.state';
import { ConvertirRutaAImagenService } from 'src/app/inventual/utils/convertir-ruta-aimagen.service';
import { CreateMastcotaComponent } from '../../create-mastcota/create-mastcota.component';

@Component({
  selector: 'app-actualizar-ticket',
  templateUrl: './actualizar-ticket.component.html',
  styleUrls: ['./actualizar-ticket.component.scss'],
        encapsulation: ViewEncapsulation.None
})
export class ActualizarTicketComponent {
  isLoading$: Observable<boolean> = inject(Store).select(SupportTicketState.isLoading);
  ticket: TicketModel = {
    supportTicketsId: 0,
    subject: '',
    description: '',
    status: true,
    userId: 0
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: TicketModel, private utils: ConvertirRutaAImagenService, private router: Router, private _snackBar: MatSnackBar, private store: Store,private dialogRef: MatDialogRef<CreateMastcotaComponent>) {
    if (data) {
      this.ticket = { ...data };
    }
  }
  ngOnInit(): void {
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  async actualizarTicket() {
    if (this.ticket.subject === '' || this.ticket.description === '') {
      this.openSnackBar('Debe llenar todos los campos', 'Cerrar');
      return;
    }

    // Enviar usuario y archivo al store
    this.store.dispatch(new UpdateTicket(this.ticket)).subscribe({
      next: () => {
        console.log('Ticket actualizado correctamente:', this.ticket);
        this.openSnackBar('Ticket actualizado correctamente', 'Cerrar');
        this.dialogRef.close();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al actualizado ticket:', error);
        this.openSnackBar('Error en el actualizado, vuelve a intentarlo', 'Cerrar');
      },
    });
  }
  
  // Reiniciar formulario
  resetForm() {
    this.ticket = {
      supportTicketsId: 0,
      subject: '',
      description: '',
      status: true,
      userId: 0
    }
  }


}
