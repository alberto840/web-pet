import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { CarritoService } from '../../services/carrito.service';
import { ProductoModel, ServicioModel } from '../../models/producto.model';
import { Observable } from 'rxjs';
import { DialogAccessService } from '../../services/dialog-access.service';

@Component({
  selector: 'app-carrito-page',
  templateUrl: './carrito-page.component.html',
  styleUrls: ['./carrito-page.component.scss']
})
export class CarritoPageComponent {
  userId: string = localStorage.getItem('userId') || '';
  servicios$: Observable<ServicioModel[]>;
  servicios: ServicioModel[] = [];

  productos$: Observable<ProductoModel[]>;
  productos: ProductoModel[] = [];

  constructor(public store: Store, public carrito: CarritoService, public dialogAccesService: DialogAccessService) {
    this.servicios$ = this.store.select(state => state.carrito.servicios);
    this.productos$ = this.store.select(state => state.carrito.productos);
  }

  ngOnInit(): void {
    this.store.dispatch([]);
    this.servicios$.subscribe((servicios) => {
      this.servicios = servicios;
    });
    this.productos$.subscribe((productos) => {
      this.productos = productos;
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
