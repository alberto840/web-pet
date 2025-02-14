import { Component, inject, ViewEncapsulation } from '@angular/core';
import { ProveedorState } from '../../state-management/proveedor/proveedor.state';
import { ProveedorModel } from '../../models/proveedor.model';
import { GetProveedor } from '../../state-management/proveedor/proveedor.action';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DialogAccessService } from '../../services/dialog-access.service';

@Component({
  selector: 'app-top-proveedores',
  templateUrl: './top-proveedores.component.html',
  styleUrls: ['./top-proveedores.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TopProveedoresComponent {
  userId: string = localStorage.getItem('userId') || '';
  isLoading$: Observable<boolean> = inject(Store).select(ProveedorState.isLoading);
  proveedores$: Observable<ProveedorModel[]>;
  proveedores: ProveedorModel[] = [];
  topProveedores: ProveedorModel[] = [];

  constructor(public router: Router, private store: Store, public dialogAccess: DialogAccessService) {
    this.proveedores$ = this.store.select(ProveedorState.getProveedores);
  }

  ngOnInit(): void {
    this.store.dispatch([new GetProveedor()]);
    this.proveedores$.subscribe((proveedores) => {
      this.proveedores = proveedores;
      this.filterTopProveedores();
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
