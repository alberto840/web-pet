import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { UsuarioModel } from '../../models/usuario.model';
import { UserService } from '../../services/user.service';
import { AddUsuario, DeleteUsuario, GetUsuario, UpdateUsuario } from './usuario.action';
import { UtilsService } from '../../utils/utils.service';

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
  constructor(private userService: UserService, private utilService: UtilsService) {}

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
  addUsuario({ getState, patchState }: StateContext<UsuarioStateModel>, { payload, img }: AddUsuario) {
    patchState({ loading: true, error: null });

    return this.userService.addUsuario(payload, img).pipe(
      tap((response) => {
        const state = getState();
        patchState({
          usuarios: [...state.usuarios, response.data],
        });
        this.utilService.registrarActividad('Usuario', 'Agregó un nuevo item a Usuario id:'+response.data.userId);
      }),
      catchError((error) => {
        patchState({ error: `Failed to add usuarios: ${error.message}` });
        this.utilService.registrarActividad('TickUsuarioet', 'No pudo agregar un nuevo item a Usuario');
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }

  @Action(UpdateUsuario)
  updateEmpleado({ getState, setState, patchState }: StateContext<UsuarioStateModel>, { payload, img }: UpdateUsuario) {
    patchState({ loading: true, error: null });

    return this.userService.updateUsuario(payload, img).pipe(
      tap((response) => {
        const state = getState();
        const usuarios = [...state.usuarios];
        const index = usuarios.findIndex((usuario) => usuario.userId === payload.userId);
        usuarios[index] = response.data;
        setState({
          ...state,
          usuarios,
        });
        this.utilService.registrarActividad('Usuario', 'Actualizó un item de Usuario id:'+response.data.userId);
      }),
      catchError((error) => {
        patchState({ error: `Failed to update usuario: ${error.message}` });
        this.utilService.registrarActividad('Usuario', 'No pudo actualizar un item de Usuario id:'+payload.userId);
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
        this.utilService.registrarActividad('Usuario', 'Eliminó un item de Usuario id:'+id);
      }),
      catchError((error) => {
        patchState({ error: `Failed to delete usuario: ${error.message}` });
        this.utilService.registrarActividad('Usuario', 'No pudo eliminar un item de Usuario id:'+id);
        return throwError(() => error);
      }),
      finalize(() => {
        patchState({ loading: false });
      })
    );
  }
}
