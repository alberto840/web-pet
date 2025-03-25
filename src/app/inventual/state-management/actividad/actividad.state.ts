import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ActividadesModel } from '../../models/actividades.model';
import { ActividadesService } from '../../services/actividades.service';
import { AddActividad, DeleteActividad, getActividad, UpdateActividad } from './actividad.action';

export interface ActivityLogStateModel {
  activityLogs: ActividadesModel[];
  loading: boolean;
  error: string | null;
}

@State<ActivityLogStateModel>({
  name: 'activityLogs',
  defaults: {
    activityLogs: [],
    loading: false,
    error: null,
  },
})
@Injectable()
export class ActivityLogState {
  constructor(private activityLogService: ActividadesService) {}

  // Selectores
  @Selector()
  static getActivityLogs(state: ActivityLogStateModel) {
    return state.activityLogs;
  }

  @Selector()
  static isLoading(state: ActivityLogStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: ActivityLogStateModel) {
    return state.error;
  }

  // Acción para obtener los registros de actividades
  @Action(getActividad)
  getActivityLogs({ patchState }: StateContext<ActivityLogStateModel>) {
    patchState({ loading: true, error: null });

    return this.activityLogService.getAllActividades().pipe(
      tap((response) => {
        patchState({ activityLogs: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load activity logs: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  // Acción para agregar un registro de actividad
  @Action(AddActividad)
  addActivityLog(
    { getState, patchState }: StateContext<ActivityLogStateModel>,
    { payload }: AddActividad
  ) {
    patchState({ loading: true, error: null });

    return this.activityLogService.addActividad(payload).pipe(
      tap((response) => {
        const state = getState();
        patchState({
          activityLogs: [...state.activityLogs, response.data],
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to add activity log: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  // Acción para eliminar un registro de actividad
  @Action(DeleteActividad)
  deleteActivityLog(
    { getState, setState, patchState }: StateContext<ActivityLogStateModel>,
    { id }: DeleteActividad
  ) {
    patchState({ loading: true, error: null });

    return this.activityLogService.deleteActividad(id).pipe(
      tap(() => {
        const state = getState();
        const filteredLogs = state.activityLogs.filter((log) => log.activityLogsId !== id);
        setState({
          ...state,
          activityLogs: filteredLogs,
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to delete activity log: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}