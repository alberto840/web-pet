import { Component, ElementRef, OnInit, ViewEncapsulation, ViewChild, inject } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { JwtdecoderService } from '../../services/jwtdecoder.service';
import { UserService } from '../../services/user.service';
import { AddUsuario } from '../../state-management/usuario/usuario.action';
import { ConvertirRutaAImagenService } from '../../utils/convertir-ruta-aimagen.service';
import { countries, CountryInfo } from '../../utils/paises_data';
import { Observable } from 'rxjs';
import { UsuarioState } from '../../state-management/usuario/usuario.state';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit {
  isLoading$: Observable<boolean> = inject(Store).select(UsuarioState.isLoading);
  //Variables
  file: File | null = null;
  validarContrasena: string = "";
  countryList: CountryInfo[] = [];
  cityList: string[] = [];
  pais: string = '';
  ciudad: string = '';
  @ViewChild('imageContainer') imageContainer!: ElementRef<HTMLDivElement>;
  selectedItemCount: number = 0;
  checked = false;
  user: UsuarioModel = {
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    location: '',
    preferredLanguage: '',
    status: true,
    rolId: 3
  }

  hide = true;
  constructor(private utils: ConvertirRutaAImagenService, private router: Router, private userService: UserService, private jwdecoder: JwtdecoderService, private store: Store, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.countryList = countries;
  }

  async registrarUsuario() {
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-zA-Z]).{8,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    // Construir ubicación del usuario
    this.user.location = this.pais + ', ' + this.ciudad;
  
    // Validaciones iniciales
    if (
      this.user.name === '' ||
      this.user.email === '' ||
      this.user.password === '' ||
      this.user.phoneNumber === '' ||
      this.user.location === '' ||
      this.user.preferredLanguage === ''
    ) {
      this.openSnackBar('Debe llenar todos los campos', 'Cerrar');
      return;
    }

    if (!emailRegex.test(this.user.email)) {
      this.openSnackBar('El correo electrónico no es válido', 'Cerrar');
      return;
    }
  
    if (this.user.password !== this.validarContrasena) {
      this.openSnackBar('Las contraseñas no coinciden', 'Cerrar');
      return;
    }
  
    if (!passwordRegex.test(this.user.password)) {
      this.openSnackBar(
        'La contraseña debe tener al menos 8 caracteres, una letra, un número y un caracter especial',
        'Cerrar'
      );
      return;
    }
  
    // Manejo de la imagen
    if (this.checked === false) {
      // Convertir imagen desde ruta local
      const filePath = 'assets/img/logo/fotoPerfil.png';
      try {
        this.file = await this.utils.convertImagePathToFile(filePath);
      } catch (error) {
        this.openSnackBar('Error al cargar la imagen predeterminada', 'Cerrar');
        console.error('Error al convertir la imagen:', error);
        return;
      }
    }
  
    // Validar que el archivo esté presente
    if (!this.file) {
      this.openSnackBar('Error en el registro, no se pudo cargar la imagen', 'Cerrar');
      return;
    }
  
    // Enviar usuario y archivo al store
    this.store.dispatch(new AddUsuario(this.user, this.file)).subscribe({
      next: () => {
        console.log('Usuario registrado correctamente:', this.user);
        this.openSnackBar('Usuario registrado correctamente', 'Cerrar');
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al registrar usuario:', error);
        this.openSnackBar('Error en el registro, vuelve a intentarlo', 'Cerrar');
      },
    });
  }
  
  // Reiniciar formulario
  resetForm() {
    this.validarContrasena = '';
    this.pais = '';
    this.ciudad = '';
    this.user = {
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      location: '',
      preferredLanguage: '',
      status: false,
      rolId: 3,
    };
  }
  

  public ciudadesDelPais(pais: CountryInfo) {
    this.user.preferredLanguage = pais.primaryLanguage;
    this.cityList = [];
    const country = this.countryList.find((country) => country.name === this.pais);
    if (country) {
      this.cityList = country.mainCities;
    }
  }

  handleFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      this.file = files[0];
      this.selectedItemCount += files.length;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = () => {
          const imgContainer = document.createElement('div');
          imgContainer.classList.add('image-container');

          const img = document.createElement('img');
          img.src = reader.result as string;
          img.classList.add('uploaded-item', 'h-[90px]');

          const deleteIcon = document.createElement('span');
          deleteIcon.classList.add('delete-icon');
          deleteIcon.innerHTML = '<i class="fas fa-trash-alt"></i>';
          deleteIcon.onclick = () => {
            imgContainer.remove();
            this.selectedItemCount--;
          };

          imgContainer.appendChild(img);
          imgContainer.appendChild(deleteIcon);

          this.imageContainer.nativeElement.appendChild(imgContainer);
        };
        // Read the file as a data URL
        reader.readAsDataURL(file);
      }
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }
}
