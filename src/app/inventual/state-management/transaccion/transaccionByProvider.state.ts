import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TransaccionService } from '../../services/transaccion.service';
import { TransaccionModel } from '../../models/producto.model';
import { GetTransaccionByProvider } from './transaccion.action';

export interface TransaccionByProviderStateModel {
  transaccionesProvider: TransaccionModel[];
  loading: boolean;
  error: string | null;
}

@State<TransaccionByProviderStateModel>({
  name: 'transaccionesProvider',
  defaults: {
    transaccionesProvider: [],
    loading: false,
    error: null,
  }
})
@Injectable()
export class TransaccionByProviderState {
  constructor(private transaccionService: TransaccionService) { }

  @Selector()
  static getTransaccionesByProvider(state: TransaccionByProviderStateModel) {
    return state.transaccionesProvider;
  }

  @Selector()
  static isLoading(state: TransaccionByProviderStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: TransaccionByProviderStateModel) {
    return state.error;
  }

  @Action(GetTransaccionByProvider)
  getTransaccionesByProvider({ patchState }: StateContext<TransaccionByProviderStateModel>, { providerId }: GetTransaccionByProvider) {
    patchState({ loading: true, error: null });

    return this.transaccionService.getTransaccionesByProviderId(providerId).pipe(
      tap((response) => {
        patchState({ transaccionesProvider: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load transacciones por provider: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}