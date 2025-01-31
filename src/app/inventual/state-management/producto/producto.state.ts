import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ProductoModel } from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';
import { AddProducto, DeleteProducto, GetProducto, UpdateProducto } from './producto.action';

export interface ProductoStateModel {
  productos: ProductoModel[];
  loading: boolean;
  error: string | null;
}

@State<ProductoStateModel>({
  name: 'productos',
  defaults: {
    productos: [],
    loading: false,
    error: null,
  }
})
@Injectable()
export class ProductoState {
  constructor(private productoService: ProductoService) {}

  @Selector()
  static getProductos(state: ProductoStateModel) {
    return state.productos;
  }

  @Selector()
  static isLoading(state: ProductoStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: ProductoStateModel) {
    return state.error;
  }

  @Action(GetProducto)
  getProductos({ patchState }: StateContext<ProductoStateModel>) {
    patchState({ loading: true, error: null });

    return this.productoService.getAllProductos().pipe(
      tap((response) => {
        patchState({ productos: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load productos: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(AddProducto)
  addProducto({ getState, patchState }: StateContext<ProductoStateModel>, { payload, img }: AddProducto) {
    patchState({ loading: true, error: null });

    return this.productoService.addProducto(payload, img).pipe(
      tap((response) => {
        const state = getState();
        patchState({
          productos: [...state.productos, response.data],
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to add producto: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(UpdateProducto)
  updateProducto({ getState, setState, patchState }: StateContext<ProductoStateModel>, { payload, img }: UpdateProducto) {
    patchState({ loading: true, error: null });

    return this.productoService.updateProducto(payload, img).pipe(
      tap((response) => {
        const state = getState();
        const productos = [...state.productos];
        const index = productos.findIndex((producto) => producto.productId === payload.productId);
        productos[index] = response.data;
        setState({
          ...state,
          productos,
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to update producto: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(DeleteProducto)
  deleteProducto({ getState, setState, patchState }: StateContext<ProductoStateModel>, { id }: DeleteProducto) {
    patchState({ loading: true, error: null });

    return this.productoService.deleteProducto(id).pipe(
      tap(() => {
        const state = getState();
        const filteredArray = state.productos.filter((producto) => producto.productId !== id);
        setState({
          ...state,
          productos: filteredArray,
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to delete producto: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}