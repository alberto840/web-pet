import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ReservaService } from '../../services/reserva.service';
import { ReservacionModel } from '../../models/producto.model';
import { AddReserva, DeleteReserva, GetReserva, UpdateReserva } from './reserva.action';
import { UtilsService } from '../../utils/utils.service';

export interface ReservaStateModel {
  reservas: ReservacionModel[];
  loading: boolean;
  error: string | null;
}

@State<ReservaStateModel>({
  name: 'reservas',
  defaults: {
    reservas: [],
    loading: false,
    error: null,
  }
})
@Injectable()
export class ReservaState {
  constructor(private reservaService: ReservaService, private utilService: UtilsService) {}

  @Selector()
  static getReservas(state: ReservaStateModel) {
    return state.reservas;
  }

  @Selector()
  static isLoading(state: ReservaStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: ReservaStateModel) {
    return state.error;
  }

  @Action(GetReserva)
  getReservas({ patchState }: StateContext<ReservaStateModel>) {
    patchState({ loading: true, error: null });

    return this.reservaService.getAllReservas().pipe(
      tap((response) => {
        patchState({ reservas: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load reservas: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(AddReserva)
  addReserva({ getState, patchState }: StateContext<ReservaStateModel>, { payload }: AddReserva) {
    patchState({ loading: true, error: null });

    return this.reservaService.addReserva(payload).pipe(
      tap((response) => {
        const state = getState();
        patchState({
          reservas: [...state.reservas, response.data],
        });        
        //this.utilService.getUserById(payload.userId).subscribe((userEmisor) => {
        //  this.utilService.getServiceById(payload.reservationId).subscribe((servicio) => {
        //    this.utilService.getProviderById(servicio.providerId).subscribe((provider) => {
        //      this.utilService.getUserById(provider.userId).subscribe((user) => {
          //      this.utilService.enviarNotificacion('El usuario '+userEmisor.name+' realizó una reserva para '+servicio.serviceName+', revisa tus reservas.', 'Reserva registrada', (user.userId ?? 0));
        //      });
        //    });
        //  });
        //});
        //this.utilService.registrarActividad('Reserva', 'Agregó un nuevo item a Reserva id:'+response.data.reservationId);
      }),
      catchError((error) => {
        patchState({ error: `Failed to add reserva: ${error.message}` });
        //this.utilService.registrarActividad('Reserva', 'No pudo agregar un nuevo item a Reserva');
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(UpdateReserva)
  updateReserva({ getState, setState, patchState }: StateContext<ReservaStateModel>, { payload }: UpdateReserva) {
    patchState({ loading: true, error: null });

    return this.reservaService.updateReserva(payload).pipe(
      tap((response) => {
        const state = getState();
        const reservas = [...state.reservas];
        setState({
          ...state,
          reservas,
        });
        //this.utilService.registrarActividad('Reserva', 'Actualizó un item de Reserva id:'+response.data.reservationId);
      }),
      catchError((error) => {
        patchState({ error: `Failed to update reserva: ${error.message}` });
        //this.utilService.registrarActividad('Reserva', 'No pudo actualizar un item de Reserva id:'+payload.reservationId);
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(DeleteReserva)
  deleteReserva({ getState, setState, patchState }: StateContext<ReservaStateModel>, { id }: DeleteReserva) {
    patchState({ loading: true, error: null });

    return this.reservaService.deleteReserva(id).pipe(
      tap(() => {
        const state = getState();
        const filteredArray = state.reservas.filter((reserva) => reserva.reservationId !== id);
        setState({
          ...state,
          reservas: filteredArray,
        });
        //this.utilService.registrarActividad('Reserva', 'Eliminó un item de Reserva id:'+id);
      }),
      catchError((error) => {
        patchState({ error: `Failed to delete reserva: ${error.message}` });
        //this.utilService.registrarActividad('Reserva', 'No pudo eliminar un item de Reserva id:'+id);
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}