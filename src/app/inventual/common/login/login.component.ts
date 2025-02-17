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
  captchaResponse!: string;

  handleCaptchaResolved(response: string) {
    this.captchaResponse = response;
    console.log('Captcha resuelto:', response);
  }
  isLoading$: Observable<boolean> = inject(Store).select(LoginState.isLoading);
  // Variables
  tokendecoded: any;
  loginUser: LoginModel = {
    email: '',
    password: ''
  };
  hide = true;
  // Constructor
  constructor(private router: Router, private jwdecoder: JwtdecoderService, private store: Store, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }
  iniciarSesion(){    
    if (this.loginUser.email === '' || this.loginUser.password === '') {
      this.openSnackBar('Debe llenar todos los campos', 'Cerrar');
      return;
    }
    if (!this.captchaResponse){
      this.openSnackBar('Debes resolver el captcha', 'Cerrar');
      return;
    }
    this.store.dispatch(new AddLogin(this.loginUser)).subscribe({
      next: (data) => {
        console.log(data);
        this.router.navigate(['/home']);
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }
}
