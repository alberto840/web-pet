import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { OfertaService } from '../../services/oferta.service';
import { AddOferta, DeleteOferta, GetOferta, UpdateOferta } from './oferta.action';
import { OfertaModel } from '../../models/producto.model';

export interface OfertaStateModel {
  ofertas: OfertaModel[];
  loading: boolean;
  error: string | null;
}

@State<OfertaStateModel>({
  name: 'ofertas',
  defaults: {
    ofertas: [],
    loading: false,
    error: null,
  }
})
@Injectable()
export class OfertaState {
  constructor(private ofertaService: OfertaService) {}

  @Selector()
  static getOfertas(state: OfertaStateModel) {
    return state.ofertas;
  }

  @Selector()
  static isLoading(state: OfertaStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: OfertaStateModel) {
    return state.error;
  }

  @Action(GetOferta)
  getOfertas({ patchState }: StateContext<OfertaStateModel>) {
    patchState({ loading: true, error: null });

    return this.ofertaService.getAllOfertas().pipe(
      tap((response) => {
        patchState({ ofertas: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load ofertas: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(AddOferta)
  addOferta({ getState, patchState }: StateContext<OfertaStateModel>, { payload }: AddOferta) {
    patchState({ loading: true, error: null });

    return this.ofertaService.addOferta(payload).pipe(
      tap((response) => {
        const state = getState();
        patchState({
          ofertas: [...state.ofertas, response.data],
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to add oferta: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(UpdateOferta)
  updateOferta({ getState, setState, patchState }: StateContext<OfertaStateModel>, { payload }: UpdateOferta) {
    patchState({ loading: true, error: null });

    return this.ofertaService.updateOferta(payload).pipe(
      tap((response) => {
        const state = getState();
        const ofertas = [...state.ofertas];
        const index = ofertas.findIndex((oferta) => oferta.offerId === payload.offerId);
        ofertas[index] = response.data;
        setState({
          ...state,
          ofertas,
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to update oferta: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(DeleteOferta)
  deleteOferta({ getState, setState, patchState }: StateContext<OfertaStateModel>, { id }: DeleteOferta) {
    patchState({ loading: true, error: null });

    return this.ofertaService.deleteOferta(id).pipe(
      tap(() => {
        const state = getState();
        const filteredArray = state.ofertas.filter((oferta) => oferta.offerId !== id);
        setState({
          ...state,
          ofertas: filteredArray,
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to delete oferta: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}