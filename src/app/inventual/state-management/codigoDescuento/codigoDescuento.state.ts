import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CodigoDescuentoService } from '../../services/codigo-descuento.service';
import { CodigoDescuentoModel } from '../../models/producto.model';
import { AddCodigoDescuento, DeleteCodigoDescuento, getCodigoDescuento, UpdateCodigoDescuento } from './codigoDescuento.action';
import { UtilsService } from '../../utils/utils.service';

export interface CodigoDescuentoStateModel {
  codigosDescuento: CodigoDescuentoModel[];
  loading: boolean;
  error: string | null;
}

@State<CodigoDescuentoStateModel>({
  name: 'codigosDescuento',
  defaults: {
    codigosDescuento: [],
    loading: false,
    error: null,
  }
})
@Injectable()
export class CodigoDescuentoState {
  constructor(private codigoDescuentoService: CodigoDescuentoService, private utilService: UtilsService) {}

  @Selector()
  static getCodigosDescuento(state: CodigoDescuentoStateModel) {
    return state.codigosDescuento;
  }

  @Selector()
  static isLoading(state: CodigoDescuentoStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: CodigoDescuentoStateModel) {
    return state.error;
  }

  @Action(getCodigoDescuento)
  getCodigosDescuento({ patchState }: StateContext<CodigoDescuentoStateModel>) {
    patchState({ loading: true, error: null });

    return this.codigoDescuentoService.getAllCodigosDescuento().pipe(
      tap((response) => {
        patchState({ codigosDescuento: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load codigosDescuento: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(AddCodigoDescuento)
  addCodigoDescuento({ getState, patchState }: StateContext<CodigoDescuentoStateModel>, { payload }: AddCodigoDescuento) {
    patchState({ loading: true, error: null });

    return this.codigoDescuentoService.addCodigoDescuento(payload).pipe(
      tap((response) => {
        const state = getState();
        patchState({
          codigosDescuento: [...state.codigosDescuento, response.data],
        });
        this.utilService.getProviderById(payload.providerId).subscribe((provider) => {
          this.utilService.getUserById(provider.userId).subscribe((user) => {
            this.utilService.enviarNotificacion('Se registró un codigo de promocion para '+provider.name+', PetWise se comunicará con usted.', 'Codigo de promocion registrado', (user.userId ?? 0));
          });
        });
        this.utilService.registrarActividad('CodigoDescuento', 'Agregó un nuevo item a CodigoDescuentos id:'+response.data.promoId);
      }),
      catchError((error) => {
        patchState({ error: `Failed to add codigoDescuento: ${error.message}` });
        this.utilService.registrarActividad('CodigoDescuento', 'No pudo agregar un nuevo item a CodigoDescuentos');
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(UpdateCodigoDescuento)
  updateCodigoDescuento({ getState, setState, patchState }: StateContext<CodigoDescuentoStateModel>, { payload }: UpdateCodigoDescuento) {
    patchState({ loading: true, error: null });

    return this.codigoDescuentoService.updateCodigoDescuento(payload).pipe(
      tap((response) => {
        const state = getState();
        const codigosDescuento = [...state.codigosDescuento];
        const index = codigosDescuento.findIndex((codigoDescuento) => codigoDescuento.promoId === payload.promoId);
        codigosDescuento[index] = response.data;
        setState({
          ...state,
          codigosDescuento,
        });
        this.utilService.registrarActividad('CodigoDescuento', 'Actualizó un item de CodigoDescuentos id:'+response.data.promoId);
      }),
      catchError((error) => {
        patchState({ error: `Failed to update codigoDescuento: ${error.message}` });
        this.utilService.registrarActividad('CodigoDescuento', 'No pudo actualizar un item de CodigoDescuentos id:'+payload.promoId);
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(DeleteCodigoDescuento)
  deleteCodigoDescuento({ getState, setState, patchState }: StateContext<CodigoDescuentoStateModel>, { id }: DeleteCodigoDescuento) {
    patchState({ loading: true, error: null });

    return this.codigoDescuentoService.deleteCodigoDescuento(id).pipe(
      tap(() => {
        const state = getState();
        const filteredArray = state.codigosDescuento.filter((codigoDescuento) => codigoDescuento.promoId !== id);
        setState({
          ...state,
          codigosDescuento: filteredArray,
        });
        this.utilService.registrarActividad('CodigoDescuento', 'Eliminó un item de CodigoDescuentos id:'+id);
      }),
      catchError((error) => {
        patchState({ error: `Failed to delete codigoDescuento: ${error.message}` });
        this.utilService.registrarActividad('CodigoDescuento', 'No pudo eliminar un item de CodigoDescuentos id:'+id);
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}