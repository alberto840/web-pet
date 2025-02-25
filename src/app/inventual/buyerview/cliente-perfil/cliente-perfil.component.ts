import { Component, ElementRef, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UsuarioByIdState } from '../../state-management/usuario/usuarioById.state';
import { UsuarioModel } from '../../models/usuario.model';
import { GetUsuarioById, UpdateUsuario } from '../../state-management/usuario/usuario.action';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DialogAccessService } from '../../services/dialog-access.service';
import { countries, CountryInfo } from '../../utils/paises_data';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilsService } from '../../utils/utils.service';

@Component({
  selector: 'app-cliente-perfil',
  templateUrl: './cliente-perfil.component.html',
  styleUrls: ['./cliente-perfil.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ClientePerfilComponent implements OnInit {
  @ViewChild('imageContainer') imageContainer!: ElementRef<HTMLDivElement>;
  selectedItemCount: number = 0;
  file: File | null = null;
  countryList: CountryInfo[] = [];
  cityList: string[] = [];
  pais: string = '';
  ciudad: string = '';
  userId: number = 0;
  isLoading$: Observable<boolean> = inject(Store).select(UsuarioByIdState.isLoading);
  usuario$: Observable<UsuarioModel>;
  usuario: UsuarioModel = {
    name: '',
    email: '',
    phoneNumber: '',
    location: '',
    preferredLanguage: '',
    status: false,
    rolId: 0
  };

  usuarioUpdated: UsuarioModel = {
    userId: 0,
    name: '',
    email: '',
    phoneNumber: '',
    location: '',
    preferredLanguage: '',
    status: false,
    rolId: 0
  }

  constructor(private route: ActivatedRoute, public router: Router, private store: Store, public dialogAccess: DialogAccessService, private _snackBar: MatSnackBar, public utils: UtilsService) {
    this.usuario$ = this.store.select(UsuarioByIdState.getUsuarioById);
  }
  //sidebar menu activation start
  menuSidebarActive: boolean = false;
  isProfileEnabled: boolean = false;
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
        console.log('Usuario registrado correctamente:', this.usuarioUpdated);
        this.openSnackBar('Usuario registrado correctamente', 'Cerrar');
        this.store.dispatch([new GetUsuarioById(Number(this.userId))]);
        this.isProfileEnabled = false;
      },
      error: (error) => {
        console.error('Error al registrar Usuario:', error);
        this.openSnackBar('Error en el registro, vuelve a intentarlo', 'Cerrar');
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
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      this.store.dispatch([new GetUsuarioById(Number(this.userId))]);
    });
    this.usuario$.subscribe((usuario) => {
      this.usuarioUpdated.userId = usuario.userId;
      this.usuario = usuario;
      this.usuarioUpdated.email = usuario.email;
      this.usuarioUpdated.location = usuario.location;
      this.usuarioUpdated.name = usuario.name;
      this.usuarioUpdated.phoneNumber = usuario.phoneNumber;
      this.usuarioUpdated.preferredLanguage = usuario.preferredLanguage;
      this.usuarioUpdated.status = usuario.status;
      this.usuarioUpdated.rolId = usuario.rolId;
      this.asignarFoto(usuario.imageUrl ?? "");
    });
    this.countryList = countries;
  }

  async asignarFoto(url: string) {
    // date in string
    //const date = new Date().toISOString().replace(/:/g, '-');
    this.utils.urlToFile(url, 'default' + this.userId).then((file) => {
      this.file = file;
    }).catch((error) => {
      console.error('Error converting URL to file:', error);
    });
  }

}
