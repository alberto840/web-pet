import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MascotaModel } from '../../models/mascota.model';
import { MascotaService } from '../../services/mascota.service';
import { AddMascota, DeleteMascota, getMascota, UpdateMascota } from './mascote.action';

export interface MascotaStateModel {
  mascotas: MascotaModel[];
  loading: boolean;
  error: string | null;
}

@State<MascotaStateModel>({
  name: 'mascotas',
  defaults: {
    mascotas: [],
    loading: false,
    error: null,
  }
})
@Injectable()
export class MascotaState {
  constructor(private mascotaService: MascotaService) {}

  @Selector()
  static getMascotas(state: MascotaStateModel) {
    return state.mascotas;
  }

  @Selector()
  static isLoading(state: MascotaStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: MascotaStateModel) {
    return state.error;
  }

  @Action(getMascota)
  getMascotas({ patchState }: StateContext<MascotaStateModel>) {
    patchState({ loading: true, error: null });

    return this.mascotaService.getAllMascotas().pipe(
      tap((response) => {
        patchState({ mascotas: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load mascotas: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(AddMascota)
  addMascota({ getState, patchState }: StateContext<MascotaStateModel>, { payload, img }: AddMascota) {
    patchState({ loading: true, error: null });

    return this.mascotaService.addMascota(payload, img).pipe(
      tap((response) => {
        const state = getState();
        patchState({
          mascotas: [...state.mascotas, response.data],
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to add mascota: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(UpdateMascota)
  updateMascota({ getState, setState, patchState }: StateContext<MascotaStateModel>, { payload, img }: UpdateMascota) {
    patchState({ loading: true, error: null });

    return this.mascotaService.updateMascota(payload, img).pipe(
      tap((response) => {
        const state = getState();
        const mascotas = [...state.mascotas];
        const index = mascotas.findIndex((mascota) => mascota.petId === payload.mascotaId);
        mascotas[index] = response.data;
        setState({
          ...state,
          mascotas,
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to update mascota: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(DeleteMascota)
  deleteMascota({ getState, setState, patchState }: StateContext<MascotaStateModel>, { id }: DeleteMascota) {
    patchState({ loading: true, error: null });

    return this.mascotaService.deleteMascota(id).pipe(
      tap(() => {
        const state = getState();
        const filteredArray = state.mascotas.filter((mascota) => mascota.petId !== id);
        setState({
          ...state,
          mascotas: filteredArray,
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to delete mascota: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}