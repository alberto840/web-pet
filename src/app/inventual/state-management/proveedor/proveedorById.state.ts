import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ProveedorModel } from '../../models/proveedor.model';
import { ProveedorService } from '../../services/proveedor.service';
import { GetProveedor, GetProveedorById } from './proveedor.action';

export interface ProveedorByIdStateModel {
    proveedor: ProveedorModel;
    loading: boolean;
    error: string | null;
}

@State<ProveedorByIdStateModel>({
    name: 'proveedor',
    defaults: {
        proveedor: {
            name: '',
            description: '',
            address: '',
            userId: 0,
            rating: 0,
            status: false
        },
        loading: false,
        error: null,
    }
})
@Injectable()
export class ProviderByIdState {
    constructor(private proveedorService: ProveedorService) { }

    @Selector()
    static getProveedorById(state: ProveedorByIdStateModel) {
        return state.proveedor;
    }

    @Selector()
    static isLoading(state: ProveedorByIdStateModel) {
        return state.loading;
    }

    @Selector()
    static getError(state: ProveedorByIdStateModel) {
        return state.error;
    }

    @Action(GetProveedorById)
    getProveedorById({ patchState }: StateContext<ProveedorByIdStateModel>, { id }: GetProveedorById) {
        patchState({ loading: true, error: null });

        return this.proveedorService.getProveedorById(id).pipe(
            tap((response) => {
                patchState({ proveedor: response.data });
            }),
            catchError((error) => {
                patchState({ error: `Failed to load proveedor: ${error.message}` });
                return throwError(() => error);
            }),
            finalize(() => {
                patchState({ loading: false });
            })
        );
    }
}
