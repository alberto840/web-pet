import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { EspecialidadProveedorModel, ProveedorModel } from '../../models/proveedor.model';
import { ProveedorService } from '../../services/proveedor.service';
import { AddProveedor, DeleteProveedor, GetProveedor, UpdateProveedor } from './proveedor.action';
import { AddEspecialidadProveedor } from '../especialidadProveedor/especialidadProveedor.action';
import { UtilsService } from '../../utils/utils.service';

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
  constructor(private proveedorService: ProveedorService, private store: Store, private utilService: UtilsService) {}

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
  addProveedor({ getState, patchState }: StateContext<ProveedorStateModel>, { payload, img, especialidad }: AddProveedor) {
    patchState({ loading: true, error: null });

    return this.proveedorService.addProveedor(payload, img).pipe(
      tap((response) => {
        const state = getState();
        patchState({
          proveedores: [...state.proveedores, response.data],
        });
        const idprovider = response.data.providerId;
        this.registrarEspecialidadProveedor(especialidad, (idprovider ?? 0) );
        this.utilService.registrarActividad('Proveedor', 'Agregó un nuevo item a Proveedor id:'+response.data.providerId);
      }),
      catchError((error) => {
        patchState({ error: `Failed to add proveedor: ${error.message}` });
        this.utilService.registrarActividad('Proveedor', 'No pudo agregar un nuevo item a Proveedor');
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
        this.utilService.registrarActividad('Proveedor', 'Actualizó un item de Proveedor id:'+response.data.providerId);
      }),
      catchError((error) => {
        patchState({ error: `Failed to update proveedor: ${error.message}` });
        this.utilService.registrarActividad('Proveedor', 'No pudo actualizar un item de Proveedor id:'+payload.providerId);
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
        this.utilService.registrarActividad('Proveedor', 'Eliminó un item de Proveedor id:'+id);
      }),
      catchError((error) => {
        patchState({ error: `Failed to delete proveedor: ${error.message}` });
        this.utilService.registrarActividad('Proveedor', 'No pudo eliminar un item de Proveedor id:'+id);
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  registrarEspecialidadProveedor(especialidadProveedor: EspecialidadProveedorModel, providerId: number) { 
    especialidadProveedor.providerId = providerId;
    this.store.dispatch(new AddEspecialidadProveedor(especialidadProveedor)).subscribe({
      next: () => {
        console.log('Especialidad proveedor registrada correctamente:', especialidadProveedor);
      },
      error: (error) => {
        console.error('Error al registrar especialidad proveedor:', error);
      },
    });
  }
}