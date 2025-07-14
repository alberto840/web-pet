import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ProductoModel } from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';
import { GetProductoById } from './producto.action';
import { ProveedorModel } from '../../models/proveedor.model';

export interface ProductByIdStateModel {
    product: ProductoModel;
    loading: boolean;
    error: string | null;
}

@State<ProductByIdStateModel>({
    name: 'productById',
    defaults: {
        product: {
            name: '',
            description: '',
            price: 0,
            stock: 0,
            status: false,
            providerId: 0,
            categoryId: 0,
            isOnSale: false,
            provider: {} as ProveedorModel
        },
        loading: false,
        error: null,
    }
})
@Injectable()
export class ProductByIdState {
    constructor(private productService: ProductoService) { }

    @Selector()
    static getProductById(state: ProductByIdStateModel) {
        return state.product;
    }

    @Selector()
    static isLoading(state: ProductByIdStateModel) {
        return state.loading;
    }

    @Selector()
    static getError(state: ProductByIdStateModel) {
        return state.error;
    }

    @Action(GetProductoById)
    getProductById({ patchState }: StateContext<ProductByIdStateModel>, { id }: GetProductoById) {
        patchState({ loading: true, error: null });

        return this.productService.getProductoById(id).pipe(
            tap((response) => {
                patchState({ product: response.data });
            }),
            catchError((error) => {
                patchState({ error: `Failed to load product: ${error.message}` });
                return throwError(() => error);
            }),
            finalize(() => {
                patchState({ loading: false });
            })
        );
    }
}