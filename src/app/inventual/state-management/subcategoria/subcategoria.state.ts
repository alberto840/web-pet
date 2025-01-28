import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SubcategoriaService } from '../../services/subcategoria.service';
import { AddSubcategoria, DeleteSubcategoria, GetSubcategoria, UpdateSubcategoria } from './subcategoria.action';
import { SubCategoriaModel } from '../../models/categoria.model';

export interface SubcategoriaStateModel {
  subcategorias: SubCategoriaModel[];
  loading: boolean;
  error: string | null;
}

@State<SubcategoriaStateModel>({
  name: 'subcategorias',
  defaults: {
    subcategorias: [],
    loading: false,
    error: null,
  }
})
@Injectable()
export class SubcategoriaState {
  constructor(private subcategoriaService: SubcategoriaService) {}

  @Selector()
  static getSubcategorias(state: SubcategoriaStateModel) {
    return state.subcategorias;
  }

  @Selector()
  static isLoading(state: SubcategoriaStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: SubcategoriaStateModel) {
    return state.error;
  }

  @Action(GetSubcategoria)
  getSubcategorias({ patchState }: StateContext<SubcategoriaStateModel>) {
    patchState({ loading: true, error: null });

    return this.subcategoriaService.getAllSubcategorias().pipe(
      tap((response) => {
        patchState({ subcategorias: response });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load subcategorias: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(AddSubcategoria)
  addSubcategoria({ getState, patchState }: StateContext<SubcategoriaStateModel>, { payload }: AddSubcategoria) {
    patchState({ loading: true, error: null });

    return this.subcategoriaService.addSubcategoria(payload).pipe(
      tap((response) => {
        const state = getState();
        patchState({
          subcategorias: [...state.subcategorias, response.data],
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to add subcategoria: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(UpdateSubcategoria)
  updateSubcategoria({ getState, setState, patchState }: StateContext<SubcategoriaStateModel>, { payload }: UpdateSubcategoria) {
    patchState({ loading: true, error: null });

    return this.subcategoriaService.updateSubcategoria(payload).pipe(
      tap((response) => {
        const state = getState();
        const subcategorias = [...state.subcategorias];
        const index = subcategorias.findIndex((subcategoria) => subcategoria.subCategoriaId === payload.subCategoriaId);
        subcategorias[index] = response.data;
        setState({
          ...state,
          subcategorias,
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to update subcategoria: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(DeleteSubcategoria)
  deleteSubcategoria({ getState, setState, patchState }: StateContext<SubcategoriaStateModel>, { id }: DeleteSubcategoria) {
    patchState({ loading: true, error: null });

    return this.subcategoriaService.deleteSubcategoria(id).pipe(
      tap(() => {
        const state = getState();
        const filteredArray = state.subcategorias.filter((subcategoria) => subcategoria.subCategoriaId !== id);
        setState({
          ...state,
          subcategorias: filteredArray,
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to delete subcategoria: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}