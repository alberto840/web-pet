import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ServicioModel } from '../../models/producto.model';
import { ServicioService } from '../../services/servicio.service';
import { GetServicioById } from '../servicio/servicio.action';

export interface ServiceByIdStateModel {
    service: ServicioModel;
    loading: boolean;
    error: string | null;
}

@State<ServiceByIdStateModel>({
    name: 'serviceById',
    defaults: {
        service: {
            serviceId: 0,
            serviceName: '',
            description: '',
            price: 0,
            duration: 0,
            status: false,
            providerId: 0,
            imageId: null,
            tipoAtencion: ''
        },
        loading: false,
        error: null,
    }
})
@Injectable()
export class ServiceByIdState {
    constructor(private serviceService: ServicioService) { }

    @Selector()
    static getServiceById(state: ServiceByIdStateModel) {
        return state.service;
    }

    @Selector()
    static isLoading(state: ServiceByIdStateModel) {
        return state.loading;
    }

    @Selector()
    static getError(state: ServiceByIdStateModel) {
        return state.error;
    }

    @Action(GetServicioById)
    getServiceById({ patchState }: StateContext<ServiceByIdStateModel>, { id }: GetServicioById) {
        patchState({ loading: true, error: null });

        return this.serviceService.getServicioById(id).pipe(
            tap((response) => {
                patchState({ service: response.data });
            }),
            catchError((error) => {
                patchState({ error: `Failed to load service: ${error.message}` });
                return throwError(() => error);
            }),
            finalize(() => {
                patchState({ loading: false });
            })
        );
    }
}