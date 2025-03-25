import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CategoriaModel } from '../../models/categoria.model';
import { CategoriaService } from '../../services/categoria.service';
import { AddCategoria, DeleteCategoria, getCategorias, UpdateCategoria } from './categoria.action';
import { UtilsService } from '../../utils/utils.service';

export interface CategoriaStateModel {
  categorias: CategoriaModel[];
  loading: boolean;
  error: string | null;
}

@State<CategoriaStateModel>({
  name: 'categorias',
  defaults: {
    categorias: [],
    loading: false,
    error: null,
  }
})
@Injectable()
export class CategoriaState {
  constructor(private categoriaService: CategoriaService, private utilService: UtilsService) {}

  @Selector()
  static getCategorias(state: CategoriaStateModel) {
    return state.categorias;
  }

  @Selector()
  static isLoading(state: CategoriaStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: CategoriaStateModel) {
    return state.error;
  }

  @Action(getCategorias)
  getCategorias({ patchState }: StateContext<CategoriaStateModel>) {
    patchState({ loading: true, error: null });

    return this.categoriaService.getAllCategorias().pipe(
      tap((response) => {
        patchState({ categorias: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load categorias: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(AddCategoria)
  addCategoria({ getState, patchState }: StateContext<CategoriaStateModel>, { payload }: AddCategoria) {
    patchState({ loading: true, error: null });

    return this.categoriaService.addCategoria(payload).pipe(
      tap((response) => {
        const state = getState();
        patchState({
          categorias: [...state.categorias, response.data],
        });
        this.utilService.registrarActividad('Categoria', 'Agregó un nuevo item a categorias id:'+response.data.categoryId);
      }),
      catchError((error) => {
        patchState({ error: `Failed to add categorias: ${error.message}` });
        this.utilService.registrarActividad('Categoria', 'No pudo agregar un nuevo item a categorias');
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(UpdateCategoria)
  updateCategoria({ getState, setState, patchState }: StateContext<CategoriaStateModel>, { payload }: UpdateCategoria) {
    patchState({ loading: true, error: null });

    return this.categoriaService.updateCategoria(payload).pipe(
      tap((response) => {
        const state = getState();
        const categorias = [...state.categorias];
        const index = categorias.findIndex((categoria) => categoria.categoryId === payload.categoryId);
        categorias[index] = response.data;
        setState({
          ...state,
          categorias,
        });
        this.utilService.registrarActividad('Categoria', 'Actualizó un item de categorias id:'+response.data.categoryId);
      }),
      catchError((error) => {
        patchState({ error: `Failed to update categoria: ${error.message}` });
        this.utilService.registrarActividad('Categoria', 'No pudo actualizar un item de categorias id:'+payload.categoryId);
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(DeleteCategoria)
  deleteCategoria({ getState, setState, patchState }: StateContext<CategoriaStateModel>, { id }: DeleteCategoria) {
    patchState({ loading: true, error: null });

    return this.categoriaService.deleteCategoria(id).pipe(
      tap(() => {
        const state = getState();
        const filteredArray = state.categorias.filter((categoria) => categoria.categoryId !== id);
        setState({
          ...state,
          categorias: filteredArray,
        });
        this.utilService.registrarActividad('Categoria', 'Eliminó un item de categorias id:'+id);
      }),
      catchError((error) => {
        patchState({ error: `Failed to delete categoria: ${error.message}` });
        this.utilService.registrarActividad('Categoria', 'No pudo eliminar un item de categorias id:'+id);
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}
