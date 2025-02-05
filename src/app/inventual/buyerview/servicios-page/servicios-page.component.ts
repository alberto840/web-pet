import { Component, inject, OnInit } from '@angular/core';
import { ServicioState } from '../../state-management/servicio/servicio.state';
import { ServicioModel } from '../../models/producto.model';
import { GetServicio } from '../../state-management/servicio/servicio.action';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UtilsService } from '../../utils/utils.service';
import { ProveedorModel } from '../../models/proveedor.model';
import { ProveedorState } from '../../state-management/proveedor/proveedor.state';
import { get } from 'http';
import { GetProveedor } from '../../state-management/proveedor/proveedor.action';

@Component({
  selector: 'app-servicios-page',
  templateUrl: './servicios-page.component.html',
  styleUrls: ['./servicios-page.component.scss']
})
export class ServiciosPageComponent implements OnInit {
  isLoading$: Observable<boolean> = inject(Store).select(ServicioState.isLoading);
  servicios: ServicioModel[] = [];
  servicios$: Observable<ServicioModel[]>;

  providers$: Observable<ProveedorModel[]>;
  providers: ProveedorModel[] = [];

  menuSidebarActive: boolean = false;
  constructor(public router: Router, private store: Store, public utils: UtilsService) {
    this.servicios$ = this.store.select(ServicioState.getServicios);
    this.providers$ = this.store.select(ProveedorState.getProveedores);
  }
  ngOnInit(): void {
    this.store.dispatch([new GetServicio(), new GetProveedor()]);

    this.servicios$.subscribe((servicios) => {
      this.servicios = servicios;
    });
    this.providers$.subscribe((providers) => {
      this.providers = providers;
    });
  }
  myfunction() {
    if (this.menuSidebarActive == false) {
      this.menuSidebarActive = true;
    }
    else {
      this.menuSidebarActive = false;
    }
  }

}
