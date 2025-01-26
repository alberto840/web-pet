import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { UsuarioModel } from '../../models/usuario.model';
import { UserService } from '../../services/user.service';
import { AddUsuario, DeleteUsuario, GetUsuario, UpdateUsuario } from './usuario.action';

export interface UsuarioStateModel {
  usuarios: UsuarioModel[];
  loading: boolean;
  error: string | null;
}

@State<UsuarioStateModel>({
  name: 'usuarios',
  defaults: {
    usuarios: [],
    loading: false,
    error: null,
  }
})
@Injectable()
export class UsuarioState {
  constructor(private userService: UserService) {}

  @Selector()
  static getUsuarios(state: UsuarioStateModel) {
    return state.usuarios;
  }

  @Selector()
  static isLoading(state: UsuarioStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: UsuarioStateModel) {
    return state.error;
  }

  @Action(GetUsuario)
  getUsuarios({ patchState }: StateContext<UsuarioStateModel>) {
    patchState({ loading: true, error: null });

    return this.userService.getAllUsuarios().pipe(
      tap((response) => {
        patchState({ usuarios: response.data });
      }),
      catchError((error) => {
        patchState({ error: `Failed to load usuarios: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(AddUsuario)
  addUsuario({ getState, patchState }: StateContext<UsuarioStateModel>, { payload }: AddUsuario) {
    patchState({ loading: true, error: null });

    return this.userService.addUsuario(payload).pipe(
      tap((response) => {
        const state = getState();
        patchState({
          usuarios: [...state.usuarios, response.data],
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to add usuarios: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(UpdateUsuario)
  updateEmpleado({ getState, setState, patchState }: StateContext<UsuarioStateModel>, { payload }: UpdateUsuario) {
    patchState({ loading: true, error: null });

    return this.userService.updateUsuario(payload).pipe(
      tap((response) => {
        const state = getState();
        const usuarios = [...state.usuarios];
        const index = usuarios.findIndex((usuario) => usuario.userId === payload.userId);
        usuarios[index] = response.data;
        setState({
          ...state,
          usuarios,
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to update usuario: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(DeleteUsuario)
  deleteEmpleado({ getState, setState, patchState }: StateContext<UsuarioStateModel>, { id }: DeleteUsuario) {
    patchState({ loading: true, error: null });

    return this.userService.deleteUsuario(id).pipe(
      tap(() => {
        const state = getState();
        const filteredArray = state.usuarios.filter((usuario) => usuario.userId !== id);
        setState({
          ...state,
          usuarios: filteredArray,
        });
      }),
      catchError((error) => {
        patchState({ error: `Failed to delete usuario: ${error.message}` });
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}
