import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ReservaService } from '../../services/reserva.service';
import { ReservacionModel } from '../../models/producto.model';
import { AddReserva, DeleteReserva, GetReservasByUser, UpdateReserva } from './reserva.action';

export interface ReservaByUserStateModel {
  reservasUser: ReservacionModel[];
  loading: boolean;
  error: string | null;
}

@State<ReservaByUserStateModel>({
  name: 'reservasUser',
  defaults: {
    reservasUser: [],
    loading: false,
    error: null,
  }
})
@Injectable()
export class ReservaByUserState {
  constructor(private reservaService: ReservaService) { }

  @Selector()
  static getReservasByUser(state: ReservaByUserStateModel) {
    return state.reservasUser;
  }

  @Selector()
  static isLoading(state: ReservaByUserStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: ReservaByUserStateModel) {
    return state.error;
  }

  @Action(GetReservasByUser)
  getReservasByUserId({ patchState }: StateContext<ReservaByUserStateModel>, { userId }: GetReservasByUser) {
    patchState({ loading: true, error: null });

    return this.reservaService.getReservasByUserId(userId).pipe(
      tap((response) => {
        patchState({ reservasUser: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load reservas por usuario: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(AddReserva)
  addReserva({ getState, patchState }: StateContext<ReservaByUserStateModel>, { payload }: AddReserva) {
    const state = getState();
    patchState({
      reservasUser: [...state.reservasUser, payload]
    });
  }

  @Action(UpdateReserva)
  updateReserva({ getState, setState }: StateContext<ReservaByUserStateModel>, { payload }: UpdateReserva) {
    const state = getState();
    const reservasUser = state.reservasUser.map(reserva =>
      reserva.reservationId === payload.reservaId ? payload : reserva
    );
    setState({
      ...state,
      reservasUser,
    });
  }

  @Action(DeleteReserva)
  deleteReserva({ getState, setState }: StateContext<ReservaByUserStateModel>, { id }: DeleteReserva) {
    const state = getState();
    setState({
      ...state,
      reservasUser: state.reservasUser.filter(reserva => reserva.reservationId !== id)
    });
  }
}