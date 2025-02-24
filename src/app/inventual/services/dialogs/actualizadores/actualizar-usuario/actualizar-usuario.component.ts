import { Component, ElementRef, Inject, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UsuarioModel } from 'src/app/inventual/models/usuario.model';
import { UpdateUsuario, GetUsuarioById, GetUsuario } from 'src/app/inventual/state-management/usuario/usuario.action';
import { UsuarioByIdState } from 'src/app/inventual/state-management/usuario/usuarioById.state';
import { CountryInfo, countries } from 'src/app/inventual/utils/paises_data';
import { UtilsService } from 'src/app/inventual/utils/utils.service';
import { DialogAccessService } from '../../../dialog-access.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-actualizar-usuario',
  templateUrl: './actualizar-usuario.component.html',
  styleUrls: ['./actualizar-usuario.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ActualizarUsuarioComponent implements OnInit {
  checked = false;
  @ViewChild('imageContainer') imageContainer!: ElementRef<HTMLDivElement>;
  selectedItemCount: number = 0;
  file: File | null = null;
  countryList: CountryInfo[] = [];
  cityList: string[] = [];
  pais: string = '';
  ciudad: string = '';
  isLoading$: Observable<boolean> = inject(Store).select(UsuarioByIdState.isLoading);
  usuario$: Observable<UsuarioModel>;
  usuario: UsuarioModel = {
    name: '',
    email: '',
    phoneNumber: '',
    location: '',
    preferredLanguage: '',
    status: true,
    rolId: 0
  };

  usuarioUpdated: UsuarioModel = {
    userId: 0,
    name: '',
    email: '',
    phoneNumber: '',
    location: '',
    preferredLanguage: '',
    status: true,
    rolId: 0
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: UsuarioModel, public router: Router, private store: Store, public dialogAccess: DialogAccessService, private _snackBar: MatSnackBar, public utils: UtilsService) {
    this.usuario$ = this.store.select(UsuarioByIdState.getUsuarioById);
    if (data) {
      this.usuario = { ...data };
      this.usuarioUpdated = {
        userId: this.usuario.userId,
        name: this.usuario.name,
        email: this.usuario.email,
        phoneNumber: this.usuario.phoneNumber,
        location: this.usuario.location,
        preferredLanguage: this.usuario.preferredLanguage,
        status: this.usuario.status,
        rolId: this.usuario.rolId
      };
    }
  }
  //sidebar menu activation start
  menuSidebarActive: boolean = false;
  isProfileEnabled: boolean = true;
  myfunction() {
    if (this.menuSidebarActive == false) {
      this.menuSidebarActive = true;
    }
    else {
      this.menuSidebarActive = false;
    }
  }

  editProfileEnable() {
    if (this.isProfileEnabled == false) {
      this.isProfileEnabled = true;
    }
    else {
      this.isProfileEnabled = false;
    }
  }

  async actualizarUsuario() {
    if (this.usuarioUpdated.name === '' || this.usuarioUpdated.email === '' || this.usuarioUpdated.phoneNumber === '' || this.usuarioUpdated.location === '' || this.usuarioUpdated.preferredLanguage === '') {
      this.openSnackBar('Por favor, llene todos los campos', 'Cerrar');
      return;
    }
    if (!this.file) {
      this.openSnackBar('Error en el registro, no se pudo cargar la imagen', 'Cerrar');
      return;
    }

    if (this.pais !== '' && this.ciudad !== '') {
      this.usuario.location = this.ciudad + ', ' + this.pais;
    }

    this.store.dispatch(new UpdateUsuario(this.usuarioUpdated, this.file)).subscribe({
      next: () => {
        console.log('Usuario actualizado correctamente:', this.usuarioUpdated);
        this.openSnackBar('Usuario actualizado correctamente', 'Cerrar');
        this.store.dispatch([new GetUsuario()]);
        this.isProfileEnabled = false;
      },
      error: (error) => {
        console.error('Error al actualizar Usuario:', error);
        this.openSnackBar('Error al actualizarlo, vuelve a intentarlo', 'Cerrar');
      },
    });
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
          img.classList.add('uploaded-item', 'h-[60px]');

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

  public ciudadesDelPais(pais: CountryInfo) {
    this.usuario.preferredLanguage = pais.primaryLanguage;
    this.cityList = [];
    const country = this.countryList.find((country) => country.name === this.pais);
    if (country) {
      this.cityList = country.mainCities;
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  //sidebar menu activation end
  hide = true;

  ngOnInit(): void {
    this.asignarFoto(this.usuario.imageUrl ?? "");
    this.countryList = countries;
  }

  async asignarFoto(url: string) {
    // date in string
    //const date = new Date().toISOString().replace(/:/g, '-');
    this.utils.urlToFile(url, 'default' + this.usuario.userId).then((file) => {
      this.file = file;
    }).catch((error) => {
      console.error('Error converting URL to file:', error);
    });
  }
}
