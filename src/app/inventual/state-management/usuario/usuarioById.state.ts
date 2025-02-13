import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { UsuarioModel } from '../../models/usuario.model';
import { UserService } from '../../services/user.service';
import { GetUsuarioById } from './usuario.action';

export interface UsuarioByIdStateModel {
    usuario: UsuarioModel;
    loading: boolean;
    error: string | null;
}

@State<UsuarioByIdStateModel>({
    name: 'usuario',
    defaults: {
        usuario: {
            name: '',
            email: '',
            password: '',
            phoneNumber: '',
            location: '',
            preferredLanguage: '',
            status: false,
            rolId: 0
        },
        loading: false,
        error: null,
    }
})
@Injectable()
export class UsuarioByIdState {
    constructor(private userService: UserService) { }

    @Selector()
    static getUsuarioById(state: UsuarioByIdStateModel) {
        return state.usuario;
    }

    @Selector()
    static isLoading(state: UsuarioByIdStateModel) {
        return state.loading;
    }

    @Selector()
    static getError(state: UsuarioByIdStateModel) {
        return state.error;
    }

    @Action(GetUsuarioById)
    getUsuarioById({ patchState }: StateContext<UsuarioByIdStateModel>, { id }: GetUsuarioById) {
        patchState({ loading: true, error: null });

        return this.userService.getUsuarioById(id).pipe(
            tap((response) => {
                patchState({ usuario: response.data });
            }),
            catchError((error) => {
                patchState({ error: `Failed to load usuario: ${error.message}` });
                return throwError(() => error);
            }),
            finalize(() => {
                patchState({ loading: false });
            })
        );
    }
}
