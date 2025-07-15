import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MascotaModel } from '../../models/mascota.model';
import { MascotaService } from '../../services/mascota.service';
import { AddMascota, DeleteMascota, GetMascotasByUser, UpdateMascota } from './mascote.action';

// --- 1. Define the State Model ---
export interface MascotasByUserStateModel {
  mascotasUser: MascotaModel[];
  loading: boolean;
  error: string | null;
}

// --- 2. Define the State ---
@State<MascotasByUserStateModel>({
  name: 'mascotasUser', // The name of your state slice
  defaults: {
    mascotasUser: [],
    loading: false,
    error: null,
  }
})
@Injectable()
export class MascotasByUserState {
  constructor(private mascotasService: MascotaService) { } // Inject your new service

  // --- 3. Selectors (to easily retrieve data from the state) ---
  @Selector()
  static getMascotasByUser(state: MascotasByUserStateModel) {
    return state.mascotasUser;
  }

  @Selector()
  static isLoading(state: MascotasByUserStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: MascotasByUserStateModel) {
    return state.error;
  }

  // --- 4. Actions Handlers (how the state reacts to dispatched actions) ---

  @Action(GetMascotasByUser)
  getMascotasByUserId({ patchState }: StateContext<MascotasByUserStateModel>, { userId }: GetMascotasByUser) {
    patchState({ loading: true, error: null });

    return this.mascotasService.getMascotasByUserId(userId).pipe(
      tap((response) => {
        // Assuming your service returns a response object with a 'data' property
        patchState({ mascotasUser: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load mascotas por usuario: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(AddMascota)
  addMascota({ getState, patchState }: StateContext<MascotasByUserStateModel>, { payload }: AddMascota) {
    const state = getState();
    patchState({
      mascotasUser: [...state.mascotasUser, payload] // Add new mascota to the array
    });
  }

  @Action(UpdateMascota)
  updateMascota({ getState, setState }: StateContext<MascotasByUserStateModel>, { payload }: UpdateMascota) {
    const state = getState();
    const mascotasUser = state.mascotasUser.map(mascota =>
      // Assuming your MascotaModel has a 'mascotaId' property to match by
      mascota.petId === payload.mascotaId ? payload : mascota
    );
    setState({
      ...state,
      mascotasUser,
    });
  }

  @Action(DeleteMascota)
  deleteMascota({ getState, setState }: StateContext<MascotasByUserStateModel>, { id }: DeleteMascota) {
    const state = getState();
    setState({
      ...state,
      mascotasUser: state.mascotasUser.filter(mascota => mascota.petId !== id) // Filter out the deleted mascota
    });
  }
}