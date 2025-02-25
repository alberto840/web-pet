import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ResenaService } from '../../services/resena.service';
import { ResenaModel } from '../../models/proveedor.model';
import { GetResenasByProviderId } from './resena.action';

export interface ResenasByProviderIdStateModel {
    resenas: ResenaModel[]; // Array de reseñas
    loading: boolean;
    error: string | null;
    providerId: number | null; // ID del proveedor
}

@State<ResenasByProviderIdStateModel>({
    name: 'resenasByProviderId',
    defaults: {
        resenas: [], // Inicialmente un array vacío
        loading: false,
        error: null,
        providerId: null, // Inicialmente sin proveedor
    }
})
@Injectable()
export class ResenasByProviderIdState {
    constructor(private resenaService: ResenaService) { }

    @Selector()
    static getResenasByProviderId(state: ResenasByProviderIdStateModel) {
        return state.resenas; // Devuelve el array de reseñas
    }

    @Selector()
    static isLoading(state: ResenasByProviderIdStateModel) {
        return state.loading;
    }

    @Selector()
    static getError(state: ResenasByProviderIdStateModel) {
        return state.error;
    }

    @Selector()
    static getProviderId(state: ResenasByProviderIdStateModel) {
        return state.providerId; // Devuelve el providerId actual
    }

    @Action(GetResenasByProviderId)
    getResenasByProviderId(
        { patchState }: StateContext<ResenasByProviderIdStateModel>,
        { providerId }: GetResenasByProviderId // Recibe el providerId como parámetro
    ) {
        patchState({ loading: true, error: null, providerId });

        return this.resenaService.getResenaById(providerId).pipe(
            tap((response) => {
                // Asume que `response.data` es un array de reseñas filtradas por providerId
                patchState({ resenas: response.data });
            }),
            catchError((error) => {
                patchState({ error: `Failed to load reviews: ${error.message}` });
                return throwError(() => error);
            }),
            finalize(() => {
                patchState({ loading: false });
            })
        );
    }
}