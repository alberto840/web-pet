import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ProveedorModel } from '../../models/proveedor.model';
import { ProveedorService } from '../../services/proveedor.service';
import { AddProveedor, DeleteProveedor, GetProveedor, UpdateProveedor } from './proveedor.action';

export interface ProveedorStateModel {
  proveedores: ProveedorModel[];
  loading: boolean;
  error: string | null;
}

@State<ProveedorStateModel>({
  name: 'proveedores',
  defaults: {
    proveedores: [],
    loading: false,
    error: null,
  }
})
@Injectable()
export class ProveedorState {
  constructor(private proveedorService: ProveedorService) {}

  @Selector()
  static getProveedores(state: ProveedorStateModel) {
    return state.proveedores;
  }

  @Selector()
  static isLoading(state: ProveedorStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: ProveedorStateModel) {
    return state.error;
  }

  @Action(GetProveedor)
  getProveedores({ patchState }: StateContext<ProveedorStateModel>) {
    patchState({ loading: true, error: null });

    return this.proveedorService.getAllProveedores().pipe(
      tap((response) => {
        patchState({ proveedores: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load proveedores: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(AddProveedor)
  addProveedor({ getState, patchState }: StateContext<ProveedorStateModel>, { payload, img }: AddProveedor) {
    patchState({ loading: true, error: null });

    return this.proveedorService.addProveedor(payload, img).pipe(
      tap((response) => {
        const state = getState();
        patchState({
          proveedores: [...state.proveedores, response.data],
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to add proveedor: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(UpdateProveedor)
  updateProveedor({ getState, setState, patchState }: StateContext<ProveedorStateModel>, { payload, img }: UpdateProveedor) {
    patchState({ loading: true, error: null });

    return this.proveedorService.updateProveedor(payload, img).pipe(
      tap((response) => {
        const state = getState();
        const proveedores = [...state.proveedores];
        const index = proveedores.findIndex((proveedor) => proveedor.providerId === payload.providerId);
        proveedores[index] = response.data;
        setState({
          ...state,
          proveedores,
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to update proveedor: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(DeleteProveedor)
  deleteProveedor({ getState, setState, patchState }: StateContext<ProveedorStateModel>, { id }: DeleteProveedor) {
    patchState({ loading: true, error: null });

    return this.proveedorService.deleteProveedor(id).pipe(
      tap(() => {
        const state = getState();
        const filteredArray = state.proveedores.filter((proveedor) => proveedor.providerId !== id);
        setState({
          ...state,
          proveedores: filteredArray,
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to delete proveedor: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}