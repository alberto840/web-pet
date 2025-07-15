import { Component, Inject, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { HorarioAtencionModel } from 'src/app/inventual/models/horarios.model';
import { ReservacionModel, ServicioModel } from 'src/app/inventual/models/producto.model';
import { getHorarioAtencion } from 'src/app/inventual/state-management/horarioAtencion/horarioAtencion.action';
import { HorarioState } from 'src/app/inventual/state-management/horarioAtencion/horarioAtencion.state';
import { AddReserva } from 'src/app/inventual/state-management/reserva/reserva.action';
import { ReservaState } from 'src/app/inventual/state-management/reserva/reserva.state';
import { CarritoService } from '../../carrito.service';
import { DialogAccessService } from '../../dialog-access.service';
import { MascotaModel } from 'src/app/inventual/models/mascota.model';
import { MascotaState } from 'src/app/inventual/state-management/mascota/mascota.state';
import { getMascota, GetMascotasByUser } from 'src/app/inventual/state-management/mascota/mascote.action';
import { UsuarioModel } from 'src/app/inventual/models/usuario.model';
import { MascotasByUserState } from 'src/app/inventual/state-management/mascota/mascotaByUserId.state';

@Component({
  selector: 'app-agendar',
  templateUrl: './agendar.component.html',
  styleUrls: ['./agendar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AgendarComponent implements OnInit {
  userId: string = localStorage.getItem('userId') || '';
  isLoading$: Observable<boolean> = inject(Store).select(ReservaState.isLoading);
  isLoadingHorarios$: Observable<boolean> = inject(Store).select(HorarioState.isLoading);

  horarios$: Observable<HorarioAtencionModel[]>;
  mascotas$: Observable<MascotaModel[]>;

  horarios: HorarioAtencionModel[] = [];
  mascotas: MascotaModel[] = [];

  reserva: ReservacionModel = {
    userId: 0,
    serviceId: 0,
    date: new Date(),
    status: "PENDIENTE",
    availabilityId: 0,
    petId: 0,
    user: {} as UsuarioModel,
    service: {} as ServicioModel,
    availability: {} as HorarioAtencionModel,
    pet: {} as MascotaModel,
  }
  constructor(@Inject(MAT_DIALOG_DATA) public servicio: ServicioModel, private store: Store, private dialogRef: MatDialogRef<AgendarComponent>, private _snackBar: MatSnackBar, private dialogAccesService: DialogAccessService) {
    this.mascotas$ = this.store.select(MascotasByUserState.getMascotasByUser);
    this.horarios$ = this.store.select(HorarioState.getHorarios);
    this.horarios$.subscribe(horarios => {
      this.horarios = horarios;
    });

  }

  ngOnInit() {
    this.store.dispatch([new getHorarioAtencion(this.servicio.serviceId), new GetMascotasByUser(this.userId ? parseInt(this.userId) : 0)]);
    this.horarios$.subscribe(horarios => {
      this.horarios = horarios;
    });

    this.mascotas$.subscribe(mascotas => {
      this.mascotas = mascotas;
    });
  }

  crearReserva() {
    this.reserva.userId = parseInt(this.userId);
    this.reserva.serviceId = (this.servicio.serviceId ?? 0);
    this.store.dispatch(new AddReserva(this.reserva)).subscribe({
      next: () => {
        console.log('reserva registrado correctamente:', this.reserva);
        this.openSnackBar('Servicio agendado y agregado al carrito', 'Cerrar');
        //this.carritoService.agregarServicioAlCarrito(this.servicio);
        this.dialogRef.close();
        this.dialogAccesService.confirmarAgenda(this.servicio);
      },
      error: (error) => {
        console.error('Error al registrar Servicio:', error);
        this.openSnackBar('Error en el registro, vuelve a intentarlo', 'Cerrar');
      },
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }


}
