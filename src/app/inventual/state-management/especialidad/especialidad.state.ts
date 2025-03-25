import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { EspecialidadModel } from '../../models/especialidad.model';
import { EspecialidadService } from '../../services/especialidad.service';
import { AddEspecialidad, DeleteEspecialidad, GetEspecialidad, UpdateEspecialidad } from './especialidad.action';
import { UtilsService } from '../../utils/utils.service';

export interface SpecialityStateModel {
  specialities: EspecialidadModel[];
  loading: boolean;
  error: string | null;
}

@State<SpecialityStateModel>({
  name: 'specialities',
  defaults: {
    specialities: [],
    loading: false,
    error: null,
  }
})
@Injectable()
export class SpecialityState {
  constructor(private specialityService: EspecialidadService, private utilService: UtilsService) {}

  @Selector()
  static getSpecialities(state: SpecialityStateModel) {
    return state.specialities;
  }

  @Selector()
  static isLoading(state: SpecialityStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: SpecialityStateModel) {
    return state.error;
  }

  @Action(GetEspecialidad)
  getSpecialities({ patchState }: StateContext<SpecialityStateModel>) {
    patchState({ loading: true, error: null });

    return this.specialityService.getAllEspecialidades().pipe(
      tap((response) => {
        patchState({ specialities: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load specialities: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(AddEspecialidad)
  addSpeciality({ getState, patchState }: StateContext<SpecialityStateModel>, { payload }: AddEspecialidad) {
    patchState({ loading: true, error: null });

    return this.specialityService.addEspecialidad(payload).pipe(
      tap((response) => {
        const state = getState();
        patchState({
          specialities: [...state.specialities, response.data],
        });
        this.utilService.registrarActividad('Especialidades', 'Agregó un nuevo item a Especialidades id:'+response.data.specialtyId);
      }),
      catchError((error) => {
        patchState({ error: `Failed to add speciality: ${error.message}` });
        this.utilService.registrarActividad('Especialidades', 'No pudo agregar un nuevo item a Especialidades');
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(UpdateEspecialidad)
  updateSpeciality({ getState, setState, patchState }: StateContext<SpecialityStateModel>, { payload }: UpdateEspecialidad) {
    patchState({ loading: true, error: null });

    return this.specialityService.updateEspecialidad(payload).pipe(
      tap((response) => {
        const state = getState();
        const specialities = [...state.specialities];
        const index = specialities.findIndex((speciality) => speciality.specialtyId === payload.specialtyId);
        specialities[index] = response.data;
        setState({
          ...state,
          specialities,
        });
        this.utilService.registrarActividad('Especialidades', 'Actualizó un item de Especialidades id:'+response.data.specialtyId);
      }),
      catchError((error) => {
        patchState({ error: `Failed to update speciality: ${error.message}` });
        this.utilService.registrarActividad('Especialidades', 'No pudo actualizar un item de Especialidades id:'+payload.specialtyId);
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(DeleteEspecialidad)
  deleteSpeciality({ getState, setState, patchState }: StateContext<SpecialityStateModel>, { id }: DeleteEspecialidad) {
    patchState({ loading: true, error: null });

    return this.specialityService.deleteEspecialidad(id).pipe(
      tap(() => {
        const state = getState();
        const filteredArray = state.specialities.filter((speciality) => speciality.specialtyId !== id);
        setState({
          ...state,
          specialities: filteredArray,
        });
        this.utilService.registrarActividad('Especialidades', 'Eliminó un item de Especialidades id:'+id);
      }),
      catchError((error) => {
        patchState({ error: `Failed to delete speciality: ${error.message}` });
        this.utilService.registrarActividad('Especialidades', 'No pudo eliminar un item de Especialidades id:'+id);
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}