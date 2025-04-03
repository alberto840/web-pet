import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TransaccionService } from '../../services/transaccion.service';
import { TransaccionModel } from '../../models/producto.model';
import { GetTransaccionByUser } from './transaccion.action';

export interface TransaccionByUserStateModel {
  transaccionesUser: TransaccionModel[];
  loading: boolean;
  error: string | null;
}

@State<TransaccionByUserStateModel>({
  name: 'transaccionesUser',
  defaults: {
    transaccionesUser: [],
    loading: false,
    error: null,
  }
})
@Injectable()
export class TransaccionByUserState {
  constructor(private transaccionService: TransaccionService) { }

  @Selector()
  static getTransaccionesByUser(state: TransaccionByUserStateModel) {
    return state.transaccionesUser;
  }

  @Selector()
  static isLoading(state: TransaccionByUserStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: TransaccionByUserStateModel) {
    return state.error;
  }

  @Action(GetTransaccionByUser)
  getTransaccionesByUser({ patchState }: StateContext<TransaccionByUserStateModel>, { userId }: GetTransaccionByUser) {
    patchState({ loading: true, error: null });

    return this.transaccionService.getTransaccionesByUserId(userId).pipe(
      tap((response) => {
        patchState({ transaccionesUser: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load transacciones por usuario: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}