import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SubsubcategoriaService } from '../../services/subsubcategoria.service';
import { AddSubsubcategoria, DeleteSubsubcategoria, GetSubsubcategoria, UpdateSubsubcategoria } from './subsubcategoria.action';
import { SubSubCategoriaModel } from '../../models/categoria.model';

export interface SubsubcategoriaStateModel {
  subsubcategorias: SubSubCategoriaModel[];
  loading: boolean;
  error: string | null;
}

@State<SubsubcategoriaStateModel>({
  name: 'subsubcategorias',
  defaults: {
    subsubcategorias: [],
    loading: false,
    error: null,
  }
})
@Injectable()
export class SubsubcategoriaState {
  constructor(private subsubcategoriaService: SubsubcategoriaService) {}

  @Selector()
  static getSubsubcategorias(state: SubsubcategoriaStateModel) {
    return state.subsubcategorias;
  }

  @Selector()
  static isLoading(state: SubsubcategoriaStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: SubsubcategoriaStateModel) {
    return state.error;
  }

  @Action(GetSubsubcategoria)
  getSubsubcategorias({ patchState }: StateContext<SubsubcategoriaStateModel>) {
    patchState({ loading: true, error: null });

    return this.subsubcategoriaService.getAllSubsubcategorias().pipe(
      tap((response) => {
        patchState({ subsubcategorias: response });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load subsubcategorias: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(AddSubsubcategoria)
  addSubsubcategoria({ getState, patchState }: StateContext<SubsubcategoriaStateModel>, { payload }: AddSubsubcategoria) {
    patchState({ loading: true, error: null });

    return this.subsubcategoriaService.addSubsubcategoria(payload).pipe(
      tap((response) => {
        const state = getState();
        patchState({
          subsubcategorias: [...state.subsubcategorias, response],
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to add subsubcategoria: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(UpdateSubsubcategoria)
  updateSubsubcategoria({ getState, setState, patchState }: StateContext<SubsubcategoriaStateModel>, { payload }: UpdateSubsubcategoria) {
    patchState({ loading: true, error: null });

    return this.subsubcategoriaService.updateSubsubcategoria(payload).pipe(
      tap((response) => {
        const state = getState();
        const subsubcategorias = [...state.subsubcategorias];
        const index = subsubcategorias.findIndex((subsubcategoria) => subsubcategoria.subSubCategoriaId === payload.subSubCategoriaId);
        subsubcategorias[index] = response.data;
        setState({
          ...state,
          subsubcategorias,
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to update subsubcategoria: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(DeleteSubsubcategoria)
  deleteSubsubcategoria({ getState, setState, patchState }: StateContext<SubsubcategoriaStateModel>, { id }: DeleteSubsubcategoria) {
    patchState({ loading: true, error: null });

    return this.subsubcategoriaService.deleteSubsubcategoria(id).pipe(
      tap(() => {
        const state = getState();
        const filteredArray = state.subsubcategorias.filter((subsubcategoria) => subsubcategoria.subSubCategoriaId !== id);
        setState({
          ...state,
          subsubcategorias: filteredArray,
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to delete subsubcategoria: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}