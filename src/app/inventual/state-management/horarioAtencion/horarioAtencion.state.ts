import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AddHorarioAtencion, DeleteHorarioAtencion, getHorarioAtencion, UpdateHorarioAtencion } from './horarioAtencion.action';
import { HorarioAtencionService } from '../../services/horario-atencion.service';
import { HorarioAtencionModel } from '../../models/horarios.model';

export interface HorarioStateModel {
  horarios: HorarioAtencionModel[];
  loading: boolean;
  error: string | null;
}

@State<HorarioStateModel>({
  name: 'horarios',
  defaults: {
    horarios: [],
    loading: false,
    error: null,
  }
})
@Injectable()
export class HorarioState {
  constructor(private horarioService: HorarioAtencionService) {}

  @Selector()
  static getHorarios(state: HorarioStateModel) {
    return state.horarios;
  }

  @Selector()
  static isLoading(state: HorarioStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: HorarioStateModel) {
    return state.error;
  }

  @Action(getHorarioAtencion)
  getHorarios({ patchState }: StateContext<HorarioStateModel>, { serviceId }: getHorarioAtencion) {
    patchState({ loading: true, error: null });

    return this.horarioService.getAllHorarios(serviceId).pipe(
      tap((response) => {
        patchState({ horarios: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load horarios: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(AddHorarioAtencion)
  addHorario({ getState, patchState }: StateContext<HorarioStateModel>, { payload, serviceId }: AddHorarioAtencion) {
    patchState({ loading: true, error: null });

    return this.horarioService.addHorario(serviceId, payload).pipe(
      tap((response) => {
        const state = getState();
        patchState({
          horarios: [...state.horarios, response.data],
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to add horario: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(DeleteHorarioAtencion)
  deleteHorario({ getState, setState, patchState }: StateContext<HorarioStateModel>, { id }: DeleteHorarioAtencion) {
    patchState({ loading: true, error: null });

    return this.horarioService.deleteHorario(id).pipe(
      tap(() => {
        const state = getState();
        const filteredArray = state.horarios.filter((horario) => horario.availabilityId !== id);
        setState({
          ...state,
          horarios: filteredArray,
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to delete horario: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}