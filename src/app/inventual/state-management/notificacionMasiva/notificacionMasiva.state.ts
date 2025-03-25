import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NotificacionMasivaService } from '../../services/notificacion-masiva.service';
import { NotificacionMasivaModel } from '../../models/notificacion.model';
import { AddNotificacionMasiva, DeleteNotificacionMasiva, GetNotificacionMasiva, UpdateNotificacionMasiva } from './notificacionMasiva.action';

export interface NotificacionMasivaStateModel {
  notificacionesMasivas: NotificacionMasivaModel[];
  loading: boolean;
  error: string | null;
}

@State<NotificacionMasivaStateModel>({
  name: 'notificacionesMasivas',
  defaults: {
    notificacionesMasivas: [],
    loading: false,
    error: null,
  }
})
@Injectable()
export class NotificacionMasivaState {
  constructor(private notificacionMasivaService: NotificacionMasivaService) {}

  @Selector()
  static getNotificacionesMasivas(state: NotificacionMasivaStateModel) {
    return state.notificacionesMasivas;
  }

  @Selector()
  static isLoading(state: NotificacionMasivaStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: NotificacionMasivaStateModel) {
    return state.error;
  }

  @Action(GetNotificacionMasiva)
  getNotificacionesMasivas({ patchState }: StateContext<NotificacionMasivaStateModel>) {
    patchState({ loading: true, error: null });

    return this.notificacionMasivaService.getAllNotificacionMasiva().pipe(
      tap((response) => {
        patchState({ notificacionesMasivas: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load notificaciones masivas: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(AddNotificacionMasiva)
  addNotificacionMasiva({ getState, patchState }: StateContext<NotificacionMasivaStateModel>, { payload }: AddNotificacionMasiva) {
    patchState({ loading: true, error: null });

    return this.notificacionMasivaService.addNotificacionMasiva(payload).pipe(
      tap((response) => {
        const state = getState();
        patchState({
          notificacionesMasivas: [...state.notificacionesMasivas, response.data],
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to add notificacion masiva: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}