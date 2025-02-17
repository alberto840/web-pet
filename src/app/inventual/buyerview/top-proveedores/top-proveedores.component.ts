import { Component, inject, ViewEncapsulation } from '@angular/core';
import { ProveedorState } from '../../state-management/proveedor/proveedor.state';
import { EspecialidadProveedorModel, ProveedorModel } from '../../models/proveedor.model';
import { GetProveedor } from '../../state-management/proveedor/proveedor.action';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DialogAccessService } from '../../services/dialog-access.service';
import { UtilsService } from '../../utils/utils.service';
import { EspecialidadModel } from '../../models/especialidad.model';
import { SpecialityState } from '../../state-management/especialidad/especialidad.state';
import { EspecialidadProveedorState } from '../../state-management/especialidadProveedor/especialidadProveedor.state';
import { GetEspecialidad } from '../../state-management/especialidad/especialidad.action';
import { GetEspecialidadProveedor } from '../../state-management/especialidadProveedor/especialidadProveedor.action';

@Component({
  selector: 'app-top-proveedores',
  templateUrl: './top-proveedores.component.html',
  styleUrls: ['./top-proveedores.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TopProveedoresComponent {
  selectedStars: number = 0;
  rate(stars: number) {
    this.selectedStars = stars;
  }
  userId: string = localStorage.getItem('userId') || '';
  isLoading$: Observable<boolean> = inject(Store).select(ProveedorState.isLoading);
  proveedores$: Observable<ProveedorModel[]>;
  especialidadesProveedor$: Observable<EspecialidadProveedorModel[]>;
  especialidadesProveedor: EspecialidadProveedorModel[] = [];
  especialidades$: Observable<EspecialidadModel[]>;
  especialidades: EspecialidadModel[] = [];
  proveedores: ProveedorModel[] = [];
  topProveedores: ProveedorModel[] = [];

  constructor(public router: Router, private store: Store, public dialogAccess: DialogAccessService, public utilsService: UtilsService) {
    this.proveedores$ = this.store.select(ProveedorState.getProveedores);
    this.especialidades$ = this.store.select(SpecialityState.getSpecialities);
    this.especialidadesProveedor$ = this.store.select(EspecialidadProveedorState.getEspecialidadesProveedor);
  }

  ngOnInit(): void {
    this.store.dispatch([new GetProveedor(), new GetEspecialidad(), new GetEspecialidadProveedor()]);
    this.proveedores$.subscribe((proveedores) => {
      this.proveedores = proveedores;
      this.filterTopProveedores();
    });

    this.especialidades$.subscribe((especialidades) => {
      this.especialidades = especialidades;
    });

    this.especialidadesProveedor$.subscribe((especialidadesProveedor) => {
      this.especialidadesProveedor = especialidadesProveedor;
    });
  }

  menuSidebarActive: boolean = false;
  myfunction() {
    if (this.menuSidebarActive == false) {
      this.menuSidebarActive = true;
    }
    else {
      this.menuSidebarActive = false;
    }
  }

  // Función para filtrar y ordenar los proveedores por rating
  filterTopProveedores(): void {
    // Ordenar los proveedores por rating de mayor a menor
    const sortedProveedores = this.proveedores.sort((a, b) => b.rating - a.rating);

    // Tomar los primeros 5 proveedores
    this.topProveedores = sortedProveedores.slice(0, 5);
  }


}
