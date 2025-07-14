import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { HorarioAtencionModel } from 'src/app/inventual/models/horarios.model';
import { MascotaModel } from 'src/app/inventual/models/mascota.model';
import { ReservacionModel, ServicioModel } from 'src/app/inventual/models/producto.model';
import { UsuarioModel } from 'src/app/inventual/models/usuario.model';
import { UpdateReserva } from 'src/app/inventual/state-management/reserva/reserva.action';
import { ReservaState } from 'src/app/inventual/state-management/reserva/reserva.state';

@Component({
  selector: 'app-actualizar-reserva',
  templateUrl: './actualizar-reserva.component.html',
  styleUrls: ['./actualizar-reserva.component.scss']
})
export class ActualizarReservaComponent {
  isLoading$: Observable<boolean> = inject(Store).select(ReservaState.isLoading);
  reserva: ReservacionModel = {
    userId: 0,
    serviceId: 0,
    date: new Date(),
    status: '',
    availabilityId: 0,
    petId: 0,
    user: {} as UsuarioModel,
    service: {} as ServicioModel,
    availability: {} as HorarioAtencionModel,
    pet: {} as MascotaModel,
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ReservacionModel,
    private router: Router,
    private _snackBar: MatSnackBar,
    private store: Store,
    private dialogRef: MatDialogRef<ActualizarReservaComponent>
  ) {
    if (data) {
      this.reserva = { ...data };
      console.log('Reserva a actualizar:', this.reserva);
    }
  }

  ngOnInit(): void {
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  async updateReserva() {

    this.store.dispatch(new UpdateReserva(this.reserva)).subscribe({
      next: () => {
        console.log('Reserva actualizada correctamente:', this.reserva);
        this.openSnackBar('Reserva actualizada correctamente', 'Cerrar');
        this.dialogRef.close();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al actualizar reserva:', error);
        this.openSnackBar('Error al actualizar, vuelve a intentarlo', 'Cerrar');
      },
    });
  }
  
  resetForm() {
    this.reserva = {
    userId: 0,
    serviceId: 0,
    date: new Date(),
    status: '',
    availabilityId: 0,
    petId: 0,
    user: {} as UsuarioModel,
    service: {} as ServicioModel,
    availability: {} as HorarioAtencionModel,
    pet: {} as MascotaModel,
    }
  }
}