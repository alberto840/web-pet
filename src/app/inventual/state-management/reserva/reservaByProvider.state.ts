import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ReservaService } from '../../services/reserva.service';
import { ReservacionModel } from '../../models/producto.model';
import { GetResenasByProviderId } from '../resena/resena.action';
import { AddReserva, DeleteReserva, GetReservasByProvider, UpdateReserva } from './reserva.action';

export interface ReservaByProviderStateModel {
  reservasProvider: ReservacionModel[];
  loading: boolean;
  error: string | null;
}

@State<ReservaByProviderStateModel>({
  name: 'reservasProvider',
  defaults: {
    reservasProvider: [],
    loading: false,
    error: null,
  }
})
@Injectable()
export class ReservaByProviderState {
  constructor(private reservaService: ReservaService) { }

  @Selector()
  static getReservasByProvider(state: ReservaByProviderStateModel) {
    return state.reservasProvider;
  }

  @Selector()
  static isLoading(state: ReservaByProviderStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: ReservaByProviderStateModel) {
    return state.error;
  }

  @Action(GetReservasByProvider)
  getReservasByIdProvider({ patchState }: StateContext<ReservaByProviderStateModel>, { providerId }: GetReservasByProvider) {
    patchState({ loading: true, error: null });

    return this.reservaService.getReservasByProviderId(providerId).pipe(
      tap((response) => {
        patchState({ reservasProvider: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load reservas por provider: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(AddReserva)
  addReserva({ getState, patchState }: StateContext<ReservaByProviderStateModel>, { payload }: AddReserva) {
    const state = getState();
    patchState({
      reservasProvider: [...state.reservasProvider, payload]
    });
  }

  @Action(UpdateReserva)
  updateReserva({ getState, setState, patchState }: StateContext<ReservaByProviderStateModel>, { payload }: UpdateReserva) {
    const state = getState();
    const reservasProvider = state.reservasProvider.map(reserva =>
      reserva.reservationId === payload.reservaId ? payload : reserva
    );
    setState({
      ...state,
      reservasProvider,
    });
  }

  @Action(DeleteReserva)
  deleteReserva({ getState, setState }: StateContext<ReservaByProviderStateModel>, { id }: DeleteReserva) {
    const state = getState();
    setState({
      ...state,
      reservasProvider: state.reservasProvider.filter(reserva => reserva.reservationId !== id)
    });
  }
}