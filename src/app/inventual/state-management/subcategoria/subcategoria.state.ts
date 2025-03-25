import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SubcategoriaService } from '../../services/subcategoria.service';
import { AddSubcategoria, DeleteSubcategoria, GetSubcategoria, UpdateSubcategoria } from './subcategoria.action';
import { SubCategoriaModel } from '../../models/categoria.model';
import { UtilsService } from '../../utils/utils.service';

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
  constructor(private subcategoriaService: SubcategoriaService, private utilService: UtilsService) {}

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
          subcategorias: [...state.subcategorias, response],
        });
        this.utilService.registrarActividad('Sub Categoria', 'Agregó un nuevo item a Sub Categoria id:'+response.subCategoriaId);
      }),
      catchError((error) => {
        patchState({ error: `Failed to add subcategoria: ${error.message}` });
        this.utilService.registrarActividad('Sub Categoria', 'No pudo agregar un nuevo item a Sub Categoria');
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
        subcategorias[index] = response;
        setState({
          ...state,
          subcategorias,
        });
        this.utilService.registrarActividad('Sub Categoria', 'Actualizó un item de Sub Categoria id:'+response.subCategoriaId);
      }),
      catchError((error) => {
        patchState({ error: `Failed to update subcategoria: ${error.message}` });
        this.utilService.registrarActividad('Sub Categoria', 'No pudo actualizar un item de Sub Categoria id:'+payload.subCategoriaId);
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
        this.utilService.registrarActividad('Sub Categoria', 'Eliminó un item de Sub Categoria id:'+id);
      }),
      catchError((error) => {
        patchState({ error: `Failed to delete subcategoria: ${error.message}` });
        this.utilService.registrarActividad('Sub Categoria', 'No pudo eliminar un item de Sub Categoria id:'+id);
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}