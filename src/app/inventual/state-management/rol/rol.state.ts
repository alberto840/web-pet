import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { RolModel } from '../../models/rol.model';
import { RolService } from '../../services/rol.service';
import { AddRol, DeleteRol, GetRol, UpdateRol } from './rol.action';

export interface RolStateModel {
  roles: RolModel[];
  loading: boolean;
  error: string | null;
}

@State<RolStateModel>({
  name: 'roles',
  defaults: {
    roles: [],
    loading: false,
    error: null,
  }
})
@Injectable()
export class RolState {
  constructor(private rolService: RolService) {}

  @Selector()
  static getRoles(state: RolStateModel) {
    return state.roles;
  }

  @Selector()
  static isLoading(state: RolStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: RolStateModel) {
    return state.error;
  }

  @Action(GetRol)
  getRoles({ patchState }: StateContext<RolStateModel>) {
    patchState({ loading: true, error: null });

    return this.rolService.getAllRoles().pipe(
      tap((response) => {
        patchState({ roles: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load roles: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(AddRol)
  addRol({ getState, patchState }: StateContext<RolStateModel>, { payload }: AddRol) {
    patchState({ loading: true, error: null });

    return this.rolService.addRol(payload).pipe(
      tap((response) => {
        const state = getState();
        patchState({
          roles: [...state.roles, response.data],
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to add rol: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(UpdateRol)
  updateRol({ getState, setState, patchState }: StateContext<RolStateModel>, { payload }: UpdateRol) {
    patchState({ loading: true, error: null });

    return this.rolService.updateRol(payload).pipe(
      tap((response) => {
        const state = getState();
        const roles = [...state.roles];
        const index = roles.findIndex((rol) => rol.rolId === payload.rolId);
        roles[index] = response.data;
        setState({
          ...state,
          roles,
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to update rol: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(DeleteRol)
  deleteRol({ getState, setState, patchState }: StateContext<RolStateModel>, { id }: DeleteRol) {
    patchState({ loading: true, error: null });

    return this.rolService.deleteRol(id).pipe(
      tap(() => {
        const state = getState();
        const filteredArray = state.roles.filter((rol) => rol.rolId !== id);
        setState({
          ...state,
          roles: filteredArray,
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to delete rol: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}