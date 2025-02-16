import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ForgotpasswordComponent implements OnInit {
  email: string = '';
  isloading: boolean = false;
  constructor(public userService: UserService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  sendEmail() {
    this.isloading = true;
    if (this.email === '') {
      this.openSnackBar('Por favor ingrese un correo electrónico', 'Cerrar');
      return;
    }
    this.userService.forgotPassword(this.email).subscribe(
      (response) => {
        this.openSnackBar('Correo enviado correctamente', 'Cerrar');
        console.log(response);
        this.isloading = false;
      },
      (error) => {
        this.openSnackBar('Error al enviar el correo', 'Cerrar');
        console.log(error);
        this.isloading = false;
      }
    );
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

}
