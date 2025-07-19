import { Action, Selector, State, StateContext } from "@ngxs/store";
import { LoginModel } from "../../models/usuario.model";
import { Injectable } from "@angular/core";
import { UserService } from "../../services/user.service";
import { AddLogin, GetLogin } from "./login.action";
import { catchError, finalize, tap, throwError } from "rxjs";
import { JwtdecoderService } from "../../services/jwtdecoder.service";
import { UtilsService } from "../../utils/utils.service";

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
    constructor(private userService: UserService, private jwtDecoder: JwtdecoderService, private utilService: UtilsService) {}
  
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
            this.guardarDatosUsuario(response.data);
            const state = getState();
            patchState({
            token: response.data,
            });
            this.utilService.registrarActividad('Login', 'Se realizo un login');
        }),
        catchError((error) => {
            patchState({ error: `Failed to login: ${error.message}` });
            this.utilService.registrarActividad('Login', 'No se pudo loggear');
            return throwError(() => error);
        }),
        finalize(() => {
            patchState({ loading: false });
        })
        );
    }

    guardarDatosUsuario(token: string) {
        localStorage.setItem('token', token);
        const rolId = this.jwtDecoder.decodeToken(token).rolId;
        const userId = this.jwtDecoder.decodeToken(token).userid;
        const idioma = this.jwtDecoder.decodeToken(token).idioma;
        const correo = this.jwtDecoder.decodeToken(token).correo;
        const nombre = this.jwtDecoder.decodeToken(token).nombre;
        const providerId = this.jwtDecoder.decodeToken(token).providerId;
        localStorage.setItem('rolId', rolId);
        localStorage.setItem('userId', userId);
        localStorage.setItem('idioma', idioma);
        localStorage.setItem('correo', correo);
        localStorage.setItem('nombre', nombre);
        localStorage.setItem('providerId', providerId);
        localStorage.setItem('isLoggedIn', true.toString());
    }
}