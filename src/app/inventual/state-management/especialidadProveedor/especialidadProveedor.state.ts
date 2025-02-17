import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { EspecialidadProveedorService } from '../../services/especialidad-proveedor.service';
import { EspecialidadProveedorModel } from '../../models/proveedor.model';
import { AddEspecialidadProveedor, DeleteEspecialidadProveedor, GetEspecialidadProveedor, UpdateEspecialidadProveedor } from './especialidadProveedor.action';

export interface EspecialidadProveedorStateModel {
  especialidadesProveedor: EspecialidadProveedorModel[];
  loading: boolean;
  error: string | null;
}

@State<EspecialidadProveedorStateModel>({
  name: 'especialidadesProveedor',
  defaults: {
    especialidadesProveedor: [],
    loading: false,
    error: null,
  }
})
@Injectable()
export class EspecialidadProveedorState {
  constructor(private especialidadProveedorService: EspecialidadProveedorService) {}

  @Selector()
  static getEspecialidadesProveedor(state: EspecialidadProveedorStateModel) {
    return state.especialidadesProveedor;
  }

  @Selector()
  static isLoading(state: EspecialidadProveedorStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: EspecialidadProveedorStateModel) {
    return state.error;
  }

  @Action(GetEspecialidadProveedor)
  getEspecialidadesProveedor({ patchState }: StateContext<EspecialidadProveedorStateModel>) {
    patchState({ loading: true, error: null });

    return this.especialidadProveedorService.getAllEspecialidadesProveedores().pipe(
      tap((response) => {
        patchState({ especialidadesProveedor: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load especialidadesProveedor: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(AddEspecialidadProveedor)
  addEspecialidadProveedor({ getState, patchState }: StateContext<EspecialidadProveedorStateModel>, { payload }: AddEspecialidadProveedor) {
    patchState({ loading: true, error: null });

    return this.especialidadProveedorService.addEspecialidadProveedor(payload).pipe(
      tap((response) => {
        const state = getState();
        patchState({
          especialidadesProveedor: [...state.especialidadesProveedor, response.data],
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to add especialidadProveedor: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(UpdateEspecialidadProveedor)
  updateEspecialidadProveedor({ getState, setState, patchState }: StateContext<EspecialidadProveedorStateModel>, { payload }: UpdateEspecialidadProveedor) {
    patchState({ loading: true, error: null });

    return this.especialidadProveedorService.updateEspecialidadProveedor(payload).pipe(
      tap((response) => {
        const state = getState();
        const especialidadesProveedor = [...state.especialidadesProveedor];
        const index = especialidadesProveedor.findIndex((especialidadProveedor) => especialidadProveedor.idSpProvider === payload.idSpProvider);
        especialidadesProveedor[index] = response.data;
        setState({
          ...state,
          especialidadesProveedor,
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to update especialidadProveedor: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(DeleteEspecialidadProveedor)
  deleteEspecialidadProveedor({ getState, setState, patchState }: StateContext<EspecialidadProveedorStateModel>, { id }: DeleteEspecialidadProveedor) {
    patchState({ loading: true, error: null });

    return this.especialidadProveedorService.deleteEspecialidadProveedor(id).pipe(
      tap(() => {
        const state = getState();
        const filteredArray = state.especialidadesProveedor.filter((especialidadProveedor) => especialidadProveedor.idSpProvider !== id);
        setState({
          ...state,
          especialidadesProveedor: filteredArray,
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to delete especialidadProveedor: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}