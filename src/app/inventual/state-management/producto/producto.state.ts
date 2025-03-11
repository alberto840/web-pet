import { State, Action, StateContext, Selector, dispatch } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ProductoModel } from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';
import { AddProducto, AddProductoByProvider, DeleteProducto, GetNewProductos, GetOfferProductos, GetProducto, UpdateProducto } from './producto.action';

export interface ProductoStateModel {
  productos: ProductoModel[];
  newProductos: ProductoModel[]; // Estado separado para nuevos productos
  offerProductos: ProductoModel[]; // Estado separado para productos en oferta
  loading: boolean;
  error: string | null;
}

@State<ProductoStateModel>({
  name: 'productos',
  defaults: {
    productos: [],
    newProductos: [], // Estado separado para nuevos productos
    offerProductos: [], // Estado separado para productos en oferta
    loading: false,
    error: null,
  }
})
@Injectable()
export class ProductoState {
  constructor(private productoService: ProductoService) { }

  @Selector()
  static getProductos(state: ProductoStateModel) {
    return state.productos;
  }

  @Selector()
  static getNewProductos(state: ProductoStateModel) {
    return state.newProductos
  }

  @Selector()
  static getOfferProductos(state: ProductoStateModel) {
    return state.offerProductos
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
  addProducto({ getState, patchState, dispatch }: StateContext<ProductoStateModel>, { payload, img }: AddProducto) {
    patchState({ loading: true, error: null });

    return this.productoService.addProducto(payload, img).pipe(
      tap((response) => {
        const state = getState();
        patchState({
          productos: [...state.productos, response.data],
        });
        dispatch(new AddProductoByProvider(response.data));
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

  @Action(GetNewProductos)
  getNewProductos({ patchState }: StateContext<ProductoStateModel>) {
    patchState({ loading: true, error: null });

    return this.productoService.getNewProductos().pipe(
      tap((response) => {
        patchState({ newProductos: response.data }); // Actualiza solo newProductos
      }),
      catchError((error) => {
        patchState({ error: `Failed to load new productos: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(GetOfferProductos)
  getOfferProductos({ patchState }: StateContext<ProductoStateModel>) {
    patchState({ loading: true, error: null });

    return this.productoService.getOfferProductos().pipe(
      tap((response) => {
        patchState({ offerProductos: response.data }); // Actualiza solo offerProductos
      }),
      catchError((error) => {
        patchState({ error: `Failed to load offer productos: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}