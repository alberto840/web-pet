import { Action, Selector, State, StateContext } from "@ngxs/store";
import { LoginModel } from "../../models/usuario.model";
import { Injectable } from "@angular/core";
import { UserService } from "../../services/user.service";
import { AddLogin, GetLogin } from "./login.action";
import { catchError, finalize, tap, throwError } from "rxjs";

export interface LoginStateModel {
    token: string;
    loading: boolean;
    error: string | null;
}

@State<LoginStateModel>({
    name: 'login',
    defaults: {
        token: '',
        loading: false,
        error: null,
    }
})
@Injectable()
export class LoginState {
    constructor(private userService: UserService) {}
  
    @Selector()
        static getToken(state: LoginStateModel) {
        return state.token;
    }

    @Selector()
    static isLoading(state: LoginStateModel) {
      return state.loading;
    }    
    
    @Action(AddLogin)
    addUsuario({ getState, patchState }: StateContext<LoginStateModel>, { payload }: AddLogin) {
        patchState({ loading: true, error: null });

        return this.userService.login(payload).pipe(
        tap((response) => {
            const state = getState();
            patchState({
            token: response.data,
            });
        }),
        catchError((error) => {
            patchState({ error: `Failed to login: ${error.message}` });
            return throwError(() => error);
        }),
        finalize(() => {
            patchState({ loading: false });
        })
        );
    }
}