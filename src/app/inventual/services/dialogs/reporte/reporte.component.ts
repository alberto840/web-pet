import { Component, inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { TicketModel } from 'src/app/inventual/models/ticket.model';
import { AddTicket } from 'src/app/inventual/state-management/ticket/ticket.action';
import { SupportTicketState } from 'src/app/inventual/state-management/ticket/ticket.state';
import { ConvertirRutaAImagenService } from 'src/app/inventual/utils/convertir-ruta-aimagen.service';
import { CreateMastcotaComponent } from '../create-mastcota/create-mastcota.component';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss']
})
export class ReporteComponent implements OnInit  {
  userId: string = localStorage.getItem('userId') || '';
  isLoading$: Observable<boolean> = inject(Store).select(SupportTicketState.isLoading);
  ticket: TicketModel = {
    supportTicketsId: 0,
    subject: '',
    description: '',
    status: 'Nuevo',
    userId: 0
  }

  constructor(private utils: ConvertirRutaAImagenService, private router: Router, private _snackBar: MatSnackBar, private store: Store,private dialogRef: MatDialogRef<CreateMastcotaComponent>) {

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
        this.dialogRef.close();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al registrar ticket:', error);
        this.openSnackBar('Error en el registro, vuelve a intentarlo', 'Cerrar');
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
