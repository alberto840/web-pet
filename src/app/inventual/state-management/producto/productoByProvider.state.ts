import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ProductoModel } from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';
import { AddProducto, DeleteProducto, GetProducto, GetProductosByProvider, UpdateProducto } from './producto.action';

export interface ProductoByProviderStateModel {
  productosProvider: ProductoModel[];
  loading: boolean;
  error: string | null;
}

@State<ProductoByProviderStateModel>({
  name: 'productosProvider',
  defaults: {
    productosProvider: [],
    loading: false,
    error: null,
  }
})
@Injectable()
export class ProductoByProviderState {
  constructor(private productoService: ProductoService) { }

  @Selector()
  static getProductosByProvider(state: ProductoByProviderStateModel) {
    return state.productosProvider;
  }

  @Selector()
  static isLoading(state: ProductoByProviderStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: ProductoByProviderStateModel) {
    return state.error;
  }

  @Action(GetProductosByProvider)
  getProductosByIdProvider({ patchState }: StateContext<ProductoByProviderStateModel>, { providerId }: GetProductosByProvider) {
    patchState({ loading: true, error: null });

    return this.productoService.getProductosByProviderId(providerId).pipe(
      tap((response) => {
        patchState({ productosProvider: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load productos por provider: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(AddProducto)
  addProducto({ getState, patchState, setState }: StateContext<ProductoByProviderStateModel>, { payload, img }: AddProducto) {
    const state = getState();
    patchState({
      productosProvider: [...state.productosProvider, payload]
    });
  }

  @Action(UpdateProducto)
  updateProducto({ getState, setState, patchState }: StateContext<ProductoByProviderStateModel>, { payload }: UpdateProducto) {
    const state = getState();
    const productosProvider = state.productosProvider.map(producto =>
      producto.productId === payload.productId ? payload : producto
    );
    setState({
      ...state,
      productosProvider,
    });
  }
}