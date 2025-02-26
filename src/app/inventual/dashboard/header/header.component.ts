import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DialogAccessService } from '../../services/dialog-access.service';
import { FormControl } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { ProductoModel, ServicioModel } from '../../models/producto.model';
import { ServicioState } from '../../state-management/servicio/servicio.state';
import { ProductoState } from '../../state-management/producto/producto.state';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { GetProducto } from '../../state-management/producto/producto.action';
import { GetServicio } from '../../state-management/servicio/servicio.action';
import { UtilsService } from '../../utils/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class HeaderComponent implements OnInit {
  rol: number = Number(localStorage.getItem('rolId')) || 0;
  userId: number = Number(localStorage.getItem('userId')) || 0;
  providerId: number = Number(localStorage.getItem('providerId')) || 0;
  control = new FormControl(''); // Control del input
  filteredOptions!: Observable<(ProductoModel | ServicioModel)[]>; // Opciones filtradas
  productos: ProductoModel[] = [];
  servicios: ServicioModel[] = [];
  productos$: Observable<ProductoModel[]>;
  servicios$: Observable<ServicioModel[]>;
  // En el componente TypeScript
  isProducto(item: ProductoModel | ServicioModel): item is ProductoModel {
    return 'name' in item;
  }
  private _filter(value: string): (ProductoModel | ServicioModel)[] {
    const filterValue = value.toLowerCase();
    return [...this.productos, ...this.servicios].filter((item) => {
      if ('name' in item) {
        // Es un ProductoModel
        return item.name.toLowerCase().includes(filterValue);
      } else {
        // Es un ServicioModel
        return item.serviceName.toLowerCase().includes(filterValue);
      }
    });
  }
  //short menu activation start
  menuShortcutActive: boolean = false;
  shortmenu() {
    if (this.menuShortcutActive == false) {
      this.menuShortcutActive = true;
      this.emailShortcutActive = false;
      this.notifyShortcutActive = false;
      this.langShortcutActive = false;
      this.proShortcutActive = false;
    }
    else {
      this.menuShortcutActive = false;
    }
  }
  //short menu activation end

  //short menu activation start
  notifyShortcutActive: boolean = false;
  notifydropdown() {
    if (this.notifyShortcutActive == false) {
      this.menuShortcutActive = false;
      this.emailShortcutActive = false;
      this.notifyShortcutActive = true;
      this.langShortcutActive = false;
      this.proShortcutActive = false;
    }
    else {
      this.notifyShortcutActive = false;
    }
  }
  //short menu activation end

  //short menu activation start
  emailShortcutActive: boolean = false;
  emaildropdown() {
    if (this.emailShortcutActive == false) {
      this.menuShortcutActive = false;
      this.emailShortcutActive = true;
      this.notifyShortcutActive = false;
      this.langShortcutActive = false;
      this.proShortcutActive = false;
    }
    else {
      this.emailShortcutActive = false;

    }
  }
  //short menu activation end

  //short menu activation start
  langShortcutActive: boolean = false;
  langdropdown() {
    if (this.langShortcutActive == false) {
      this.menuShortcutActive = false;
      this.emailShortcutActive = false;
      this.notifyShortcutActive = false;
      this.langShortcutActive = true;
      this.proShortcutActive = false;
    }
    else {
      this.langShortcutActive = false;

    }
  }
  //short menu activation end

  //short menu activation start
  proShortcutActive: boolean = false;
  prodropdown() {
    if (this.proShortcutActive == false) {
      this.menuShortcutActive = false;
      this.emailShortcutActive = false;
      this.notifyShortcutActive = false;
      this.langShortcutActive = false;
      this.proShortcutActive = true;
    }
    else {
      this.proShortcutActive = false;

    }
  }
  //short menu activation end

  constructor(public dialogAccess: DialogAccessService, public router: Router, private store: Store, public utils: UtilsService) {
    this.servicios$ = this.store.select(ServicioState.getServicios);
    this.productos$ = this.store.select(ProductoState.getProductos);
  }

  ngOnInit(): void {
    this.store.dispatch([new GetProducto(), new GetServicio()]);
    this.filteredOptions = this.control.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
    this.productos$.subscribe((productos) => {
      this.productos = productos;
    });
    this.servicios$.subscribe((servicios) => {
      this.servicios = servicios;
    });
  }
}
