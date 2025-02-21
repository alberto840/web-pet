import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NotificacionModel } from '../../models/notificacion.model';
import { NotificacionService } from '../../services/notificacion.service';
import { AddNotificacion, DeleteNotificacion, GetNotificacion, UpdateNotificacion } from './notificacion.action';

export interface NotificacionStateModel {
  notificaciones: NotificacionModel[];
  loading: boolean;
  error: string | null;
}

@State<NotificacionStateModel>({
  name: 'notificaciones',
  defaults: {
    notificaciones: [],
    loading: false,
    error: null,
  }
})
@Injectable()
export class NotificacionState {
  constructor(private notificacionService: NotificacionService) {}

  @Selector()
  static getNotificaciones(state: NotificacionStateModel) {
    return state.notificaciones;
  }

  @Selector()
  static isLoading(state: NotificacionStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: NotificacionStateModel) {
    return state.error;
  }

  @Action(GetNotificacion)
  getNotificaciones({ patchState }: StateContext<NotificacionStateModel>) {
    patchState({ loading: true, error: null });

    return this.notificacionService.getAllNotificaciones().pipe(
      tap((response) => {
        patchState({ notificaciones: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load notificaciones: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(AddNotificacion)
  addNotificacion({ getState, patchState }: StateContext<NotificacionStateModel>, { payload }: AddNotificacion) {
    patchState({ loading: true, error: null });

    return this.notificacionService.addNotificacion(payload).pipe(
      tap((response) => {
        const state = getState();
        patchState({
          notificaciones: [...state.notificaciones, response.data],
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to add notificacion: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(UpdateNotificacion)
  updateNotificacion({ getState, setState, patchState }: StateContext<NotificacionStateModel>, { payload }: UpdateNotificacion) {
    patchState({ loading: true, error: null });

    return this.notificacionService.updateNotificacion(payload).pipe(
      tap((response) => {
        const state = getState();
        const notificaciones = [...state.notificaciones];
        const index = notificaciones.findIndex((notificacion) => notificacion.notificationId === payload.notificationId);
        notificaciones[index] = response.data;
        setState({
          ...state,
          notificaciones,
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to update notificacion: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(DeleteNotificacion)
  deleteNotificacion({ getState, setState, patchState }: StateContext<NotificacionStateModel>, { id }: DeleteNotificacion) {
    patchState({ loading: true, error: null });

    return this.notificacionService.deleteNotificacion(id).pipe(
      tap(() => {
        const state = getState();
        const filteredArray = state.notificaciones.filter((notificacion) => notificacion.notificationId !== id);
        setState({
          ...state,
          notificaciones: filteredArray,
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to delete notificacion: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}