import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { LoginModel } from '../../models/usuario.model';
import { JwtdecoderService } from '../../services/jwtdecoder.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Store } from '@ngxs/store';
import { AddLogin } from '../../state-management/login/login.action';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { LoginState } from '../../state-management/login/login.state';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  isLoading$: Observable<boolean> = inject(Store).select(LoginState.isLoading);
  // Variables
  tokendecoded: any;
  loginUser: LoginModel = {
    email: '',
    password: ''
  };
  hide = true;
  // Constructor
  constructor(private router: Router, private userService: UserService, private jwdecoder: JwtdecoderService, private store: Store, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }
  iniciarSesion(){    
    if (this.loginUser.email === '' || this.loginUser.password === '') {
      this.openSnackBar('Debe llenar todos los campos', 'Cerrar');
      return;
    }
    this.store.dispatch(new AddLogin(this.loginUser)).subscribe({
      next: () => {
        this.openSnackBar('Login correctamente', 'Cerrar');
      },
      error: (error) => {
        this.openSnackBar('Credenciales Incorrectas, Vuelve a intentar', 'Cerrar');
      }
    });
    this.loginUser = {
      email: '',
      password: ''
    };
  }
  guardarDatos(token: string, userid: number, nombre: string, primerApellido: string, segundoApellido: string, rolid: number, sucursalid: number, correo: string, empCode: string, fechaIngreso: string, estado: boolean, direccion: string, edad: string, telefono: string){
    // Guarda los datos en el local storage, los Id se convierten a string, debes convertirlos a number al recuperarlos
    localStorage.setItem('token', token);
    localStorage.setItem('userid', userid.toString());
    localStorage.setItem('empCode', empCode);
    localStorage.setItem('nombre', nombre);
    localStorage.setItem('primerApellido', primerApellido);
    localStorage.setItem('segundoApellido', segundoApellido);
    localStorage.setItem('correo', correo);
    localStorage.setItem('fechaIngreso', fechaIngreso);
    localStorage.setItem('estado', estado.toString());
    localStorage.setItem('direccion', direccion);
    localStorage.setItem('edad', edad);
    localStorage.setItem('telefono', telefono);
    localStorage.setItem('rol', rolid.toString());
    localStorage.setItem('sucursal', sucursalid.toString());
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }
}
