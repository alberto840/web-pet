import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ServicioService } from '../../services/servicio.service';
import { AddServicio, AddServicioByProvider, DeleteServicio, GetNewServicios, GetOfferServicios, GetServicio, UpdateServicio } from './servicio.action';
import { ServicioModel } from '../../models/producto.model';
import { AddHorarioAtencion } from '../horarioAtencion/horarioAtencion.action';

export interface ServicioStateModel {
  servicios: ServicioModel[];
  newServicios: ServicioModel[]; // Estado separado para nuevos servicios
  offerServicios: ServicioModel[]; // Estado separado para servicios en oferta
  loading: boolean;
  error: string | null;
}

@State<ServicioStateModel>({
  name: 'servicios',
  defaults: {
    servicios: [],
    newServicios: [], // Estado separado para nuevos servicios
    offerServicios: [], // Estado separado para servicios en oferta
    loading: false,
    error: null,
  }
})
@Injectable()
export class ServicioState {
  constructor(private servicioService: ServicioService, private store: Store) {}

  @Selector()
  static getServicios(state: ServicioStateModel) {
    return state.servicios;
  }

  @Selector()
  static getNewServicios(state: ServicioStateModel) {
    return state.newServicios;
  }

  @Selector()
  static getOfferServicios(state: ServicioStateModel) {
    return state.offerServicios;
  }

  @Selector()
  static isLoading(state: ServicioStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: ServicioStateModel) {
    return state.error;
  }

  @Action(GetServicio)
  getServicios({ patchState }: StateContext<ServicioStateModel>) {
    patchState({ loading: true, error: null });

    return this.servicioService.getAllServicios().pipe(
      tap((response) => {
        patchState({ servicios: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load servicios: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(AddServicio)
  addServicio({ getState, patchState, dispatch }: StateContext<ServicioStateModel>, { payload, img, horarios }: AddServicio) {
    patchState({ loading: true, error: null });

    return this.servicioService.addServicio(payload, img).pipe(
      tap((response) => {
        const state = getState();
        patchState({
          servicios: [...state.servicios, response.data],
        });
        this.crearHorarios(horarios, (response.data.serviceId ?? 0));
        dispatch(new AddServicioByProvider(response.data));
      }),
      catchError((error) => {
        patchState({ error: `Failed to add servicio: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(UpdateServicio)
  updateServicio({ getState, setState, patchState }: StateContext<ServicioStateModel>, { payload, img }: UpdateServicio) {
    patchState({ loading: true, error: null });

    return this.servicioService.updateServicio(payload, img).pipe(
      tap((response) => {
        const state = getState();
        const servicios = [...state.servicios];
        const index = servicios.findIndex((servicio) => servicio.serviceId === payload.serviceId);
        servicios[index] = response.data;
        setState({
          ...state,
          servicios,
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to update servicio: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(DeleteServicio)
  deleteServicio({ getState, setState, patchState }: StateContext<ServicioStateModel>, { id }: DeleteServicio) {
    patchState({ loading: true, error: null });

    return this.servicioService.deleteServicio(id).pipe(
      tap(() => {
        const state = getState();
        const filteredArray = state.servicios.filter((servicio) => servicio.serviceId !== id);
        setState({
          ...state,
          servicios: filteredArray,
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to delete servicio: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }


  @Action(GetNewServicios)
  getNewServicios({ patchState }: StateContext<ServicioStateModel>) {
    patchState({ loading: true, error: null });

    return this.servicioService.getNewServicios().pipe(
      tap((response) => {
        patchState({ newServicios: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load new servicios: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(GetOfferServicios)
  getOfferServicios({ patchState }: StateContext<ServicioStateModel>) {
    patchState({ loading: true, error: null });

    return this.servicioService.getOfferServicios().pipe(
      tap((response) => {
        patchState({ offerServicios: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load offer servicios: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  crearHorarios(horarios: string[], serviceId: number) {    
    this.store.dispatch(new AddHorarioAtencion(horarios, serviceId)).subscribe({
      next: () => {
        console.log('Horarios registrado correctamente:', horarios);
      },
      error: (error) => {
        console.error('Error al registrar horarios:', error);
      },
    });
  }
}