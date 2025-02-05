import { Component, inject, OnInit } from '@angular/core';
import { ProductoState } from '../../state-management/producto/producto.state';
import { ProductoModel, ServicioModel } from '../../models/producto.model';
import { GetProducto } from '../../state-management/producto/producto.action';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DialogAccessService } from '../../services/dialog-access.service';
import { ServicioState } from '../../state-management/servicio/servicio.state';
import { GetServicio } from '../../state-management/servicio/servicio.action';

@Component({
  selector: 'app-quickview',
  templateUrl: './quickview.component.html',
  styleUrls: ['./quickview.component.scss']
})
export class QuickviewComponent implements OnInit {
  checked = false;
  checked1 = false;
  userId: string = localStorage.getItem('userId') || '';
  isLoading$: Observable<boolean> = inject(Store).select(ProductoState.isLoading);
  productos$: Observable<ProductoModel[]>;
  productos: ProductoModel[] = [];
  
  isLoadingService$: Observable<boolean> = inject(Store).select(ServicioState.isLoading);
  servicios$: Observable<ServicioModel[]>;
  servicios: ServicioModel[] = [];

  constructor(public router: Router, private store: Store, public dialogAccess: DialogAccessService) {
    this.productos$ = this.store.select(ProductoState.getProductos);
    this.servicios$ = this.store.select(ServicioState.getServicios);
  }

  ngOnInit(): void {
    this.store.dispatch([new GetProducto(), new GetServicio()]);
    this.productos$.subscribe((productos) => {
      this.productos = productos;
    });
    this.servicios$.subscribe((servicios) => {
      this.servicios = servicios;
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

}
