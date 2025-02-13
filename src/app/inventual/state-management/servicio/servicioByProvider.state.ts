import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ServicioService } from '../../services/servicio.service'; // Asegúrate de importar el servicio correcto
import { ServicioModel } from '../../models/producto.model';
import { GetServiciosByProvider } from './servicio.action';

export interface ServicioByProviderStateModel {
  serviciosProvider: ServicioModel[];
  loading: boolean;
  error: string | null;
}

@State<ServicioByProviderStateModel>({
  name: 'serviciosProvider',
  defaults: {
    serviciosProvider: [],
    loading: false,
    error: null,
  }
})
@Injectable()
export class ServiceByProviderState {
  constructor(private servicioService: ServicioService) {}

  @Selector()
  static getServiciosByProvider(state: ServicioByProviderStateModel) {
    return state.serviciosProvider;
  }

  @Selector()
  static isLoading(state: ServicioByProviderStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: ServicioByProviderStateModel) {
    return state.error;
  }

  @Action(GetServiciosByProvider)
  getServiciosByProvider({ patchState }: StateContext<ServicioByProviderStateModel>, { providerId }: GetServiciosByProvider) {
    patchState({ loading: true, error: null });

    return this.servicioService.getServiciosByProviderId(providerId).pipe(
      tap((response) => {
        patchState({ serviciosProvider: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load servicios por provider: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}