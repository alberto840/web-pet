import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ResenaService } from '../../services/resena.service';
import { ResenaModel } from '../../models/proveedor.model';
import { AddResena, DeleteResena, GetResena, UpdateResena } from './resena.action';
import { UtilsService } from '../../utils/utils.service';
import { UsuarioModel } from '../../models/usuario.model';

export interface ResenaStateModel {
  resenas: ResenaModel[];
  loading: boolean;
  error: string | null;
}

@State<ResenaStateModel>({
  name: 'resenas',
  defaults: {
    resenas: [],
    loading: false,
    error: null,
  },
})
@Injectable()
export class ResenaState {
  constructor(private resenaService: ResenaService, private utilService: UtilsService) {}

  @Selector()
  static getResenas(state: ResenaStateModel) {
    return state.resenas;
  }

  @Selector()
  static isLoading(state: ResenaStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: ResenaStateModel) {
    return state.error;
  }

  @Action(GetResena)
  getResenas({ patchState }: StateContext<ResenaStateModel>) {
    patchState({ loading: true, error: null });

    return this.resenaService.getAllResenas().pipe(
      tap((response) => {
        patchState({ resenas: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load resenas: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(AddResena)
  addResena({ getState, patchState }: StateContext<ResenaStateModel>, { payload }: AddResena) {
    patchState({ loading: true, error: null });

    return this.resenaService.addResena(payload).pipe(
      tap((response) => {
        const state = getState();
        patchState({
          resenas: [...state.resenas, response.data],
        });
        //this.utilService.registrarActividad('Review', 'Agregó un nuevo item a Review id:'+response.data.reviewsId);
      }),
      catchError((error) => {
        patchState({ error: `Failed to add resena: ${error.message}` });
        //this.utilService.registrarActividad('Review', 'No pudo agregar un nuevo item a Review');
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(UpdateResena)
  updateResena({ getState, setState, patchState }: StateContext<ResenaStateModel>, { payload }: UpdateResena) {
    patchState({ loading: true, error: null });

    return this.resenaService.updateResena(payload).pipe(
      tap((response) => {
        const state = getState();
        const resenas = [...state.resenas];
        const index = resenas.findIndex((resena) => resena.reviewsId === payload.reviewsId);
        resenas[index] = response.data;
        setState({
          ...state,
          resenas,
        });
        this.utilService.registrarActividad('Review', 'Actualizó un item de Review id:'+response.data.reviewsId);
      }),
      catchError((error) => {
        patchState({ error: `Failed to update resena: ${error.message}` });
        this.utilService.registrarActividad('Review', 'No pudo actualizar un item de Review id:'+payload.reviewsId);
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(DeleteResena)
  deleteResena({ getState, setState, patchState }: StateContext<ResenaStateModel>, { id }: DeleteResena) {
    patchState({ loading: true, error: null });

    return this.resenaService.deleteResena(id).pipe(
      tap(() => {
        const state = getState();
        const filteredArray = state.resenas.filter((resena) => resena.reviewsId !== id);
        setState({
          ...state,
          resenas: filteredArray,
        });
        this.utilService.registrarActividad('Review', 'Eliminó un item de Review id:'+id);
      }),
      catchError((error) => {
        patchState({ error: `Failed to delete resena: ${error.message}` });
        this.utilService.registrarActividad('Review', 'No pudo eliminar un item de Review id:'+id);
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}