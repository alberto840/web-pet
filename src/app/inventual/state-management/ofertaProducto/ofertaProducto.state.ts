import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { OfertaProductoService } from '../../services/oferta-producto.service';
import { OfertaProductoModel } from '../../models/producto.model';
import { AddOfertaProducto, DeleteOfertaProducto, GetOfertaProducto, UpdateOfertaProducto } from './ofertaProducto.action';
import { UtilsService } from '../../utils/utils.service';

export interface OfertaProductoStateModel {
  ofertasProducto: OfertaProductoModel[];
  loading: boolean;
  error: string | null;
}

@State<OfertaProductoStateModel>({
  name: 'ofertasProducto',
  defaults: {
    ofertasProducto: [],
    loading: false,
    error: null,
  }
})
@Injectable()
export class OfertaProductoState {
  constructor(private ofertaProductoService: OfertaProductoService, private utilService: UtilsService) {}

  @Selector()
  static getOfertasProducto(state: OfertaProductoStateModel) {
    return state.ofertasProducto;
  }

  @Selector()
  static isLoading(state: OfertaProductoStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: OfertaProductoStateModel) {
    return state.error;
  }

  @Action(GetOfertaProducto)
  getOfertasProducto({ patchState }: StateContext<OfertaProductoStateModel>) {
    patchState({ loading: true, error: null });

    return this.ofertaProductoService.getAllOfertaProductos().pipe(
      tap((response) => {
        patchState({ ofertasProducto: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load ofertasProducto: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(AddOfertaProducto)
  addOfertaProducto({ getState, patchState }: StateContext<OfertaProductoStateModel>, { payload }: AddOfertaProducto) {
    patchState({ loading: true, error: null });

    return this.ofertaProductoService.addOfertaProducto(payload).pipe(
      tap((response) => {
        const state = getState();
        patchState({
          ofertasProducto: [...state.ofertasProducto, response.data],
        });
        this.utilService.registrarActividad('Oferta Producto', 'Agregó un nuevo item a Oferta Producto id:'+response.data.offersProductsId);
      }),
      catchError((error) => {
        patchState({ error: `Failed to add ofertaProducto: ${error.message}` });
        this.utilService.registrarActividad('Oferta Producto', 'No pudo agregar un nuevo item a Oferta Producto');
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(UpdateOfertaProducto)
  updateOfertaProducto({ getState, setState, patchState }: StateContext<OfertaProductoStateModel>, { payload }: UpdateOfertaProducto) {
    patchState({ loading: true, error: null });

    return this.ofertaProductoService.updateOfertaProducto(payload).pipe(
      tap((response) => {
        const state = getState();
        const ofertasProducto = [...state.ofertasProducto];
        const index = ofertasProducto.findIndex((ofertaProducto) => ofertaProducto.offersProductsId === payload.offersProductsId);
        ofertasProducto[index] = response.data;
        setState({
          ...state,
          ofertasProducto,
        });
        this.utilService.registrarActividad('Oferta Producto', 'Actualizó un item de Oferta Producto id:'+response.data.offersProductsId);
      }),
      catchError((error) => {
        patchState({ error: `Failed to update ofertaProducto: ${error.message}` });
        this.utilService.registrarActividad('Oferta Producto', 'No pudo actualizar un item de Oferta Producto id:'+payload.offersProductsId);
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(DeleteOfertaProducto)
  deleteOfertaProducto({ getState, setState, patchState }: StateContext<OfertaProductoStateModel>, { id }: DeleteOfertaProducto) {
    patchState({ loading: true, error: null });

    return this.ofertaProductoService.deleteOfertaProducto(id).pipe(
      tap(() => {
        const state = getState();
        const filteredArray = state.ofertasProducto.filter((ofertaProducto) => ofertaProducto.offersProductsId !== id);
        setState({
          ...state,
          ofertasProducto: filteredArray,
        });
        this.utilService.registrarActividad('Oferta Producto', 'Eliminó un item de Oferta Producto id:'+id);
      }),
      catchError((error) => {
        patchState({ error: `Failed to delete ofertaProducto: ${error.message}` });
        this.utilService.registrarActividad('Oferta Producto', 'No pudo eliminar un item de Oferta Producto id:'+id);
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}