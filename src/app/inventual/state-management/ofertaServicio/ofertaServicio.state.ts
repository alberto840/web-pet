import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { OfertaServicioService } from '../../services/oferta-servicio.service';
import { OfertaServicioModel } from '../../models/producto.model';
import { AddOfertaServicio, DeleteOfertaServicio, GetOfertaServicio, UpdateOfertaServicio } from './ofertaServicio.action';
import { UtilsService } from '../../utils/utils.service';

export interface OfertaServicioStateModel {
  ofertasServicio: OfertaServicioModel[];
  loading: boolean;
  error: string | null;
}

@State<OfertaServicioStateModel>({
  name: 'ofertasServicio',
  defaults: {
    ofertasServicio: [],
    loading: false,
    error: null,
  }
})
@Injectable()
export class OfertaServicioState {
  constructor(private ofertaServicioService: OfertaServicioService, private utilService: UtilsService) {}

  @Selector()
  static getOfertasServicio(state: OfertaServicioStateModel) {
    return state.ofertasServicio;
  }

  @Selector()
  static isLoading(state: OfertaServicioStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: OfertaServicioStateModel) {
    return state.error;
  }

  @Action(GetOfertaServicio)
  getOfertasServicio({ patchState }: StateContext<OfertaServicioStateModel>) {
    patchState({ loading: true, error: null });

    return this.ofertaServicioService.getAllOfertaServicio().pipe(
      tap((response) => {
        patchState({ ofertasServicio: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load ofertasServicio: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(AddOfertaServicio)
  addOfertaServicio({ getState, patchState }: StateContext<OfertaServicioStateModel>, { payload }: AddOfertaServicio) {
    patchState({ loading: true, error: null });

    return this.ofertaServicioService.addOfertaServicio(payload).pipe(
      tap((response) => {
        const state = getState();
        patchState({
          ofertasServicio: [...state.ofertasServicio, response.data],
        });
        this.utilService.registrarActividad('Oferta Servicio', 'Agregó un nuevo item a Oferta Servicio id:'+response.data.offersServicesId);
      }),
      catchError((error) => {
        patchState({ error: `Failed to add ofertaServicio: ${error.message}` });
        this.utilService.registrarActividad('Oferta Servicio', 'No pudo agregar un nuevo item a Oferta Servicio');
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(UpdateOfertaServicio)
  updateOfertaServicio({ getState, setState, patchState }: StateContext<OfertaServicioStateModel>, { payload }: UpdateOfertaServicio) {
    patchState({ loading: true, error: null });

    return this.ofertaServicioService.updateOfertaServicio(payload).pipe(
      tap((response) => {
        const state = getState();
        const ofertasServicio = [...state.ofertasServicio];
        const index = ofertasServicio.findIndex((ofertaServicio) => ofertaServicio.offersServicesId === payload.offersServicesId);
        ofertasServicio[index] = response.data;
        setState({
          ...state,
          ofertasServicio,
        });
        this.utilService.registrarActividad('Oferta Servicio', 'Actualizó un item de Oferta Servicio id:'+response.data.offersServicesId);
      }),
      catchError((error) => {
        patchState({ error: `Failed to update ofertaServicio: ${error.message}` });
        this.utilService.registrarActividad('Oferta Servicio', 'No pudo actualizar un item de Oferta Servicio id:'+payload.offersServicesId);
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(DeleteOfertaServicio)
  deleteOfertaServicio({ getState, setState, patchState }: StateContext<OfertaServicioStateModel>, { id }: DeleteOfertaServicio) {
    patchState({ loading: true, error: null });

    return this.ofertaServicioService.deleteOfertaServicio(id).pipe(
      tap(() => {
        const state = getState();
        const filteredArray = state.ofertasServicio.filter((ofertaServicio) => ofertaServicio.offersServicesId !== id);
        setState({
          ...state,
          ofertasServicio: filteredArray,
        });
        this.utilService.registrarActividad('Oferta Servicio', 'Eliminó un item de Oferta Servicio id:'+id);
      }),
      catchError((error) => {
        patchState({ error: `Failed to delete ofertaServicio: ${error.message}` });
        this.utilService.registrarActividad('Oferta Servicio', 'No pudo eliminar un item de Oferta Servicio id:'+id);
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}