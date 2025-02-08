import { Component, Input } from '@angular/core';
import { ProductoModel } from '../../models/producto.model';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ProveedorModel } from '../../models/proveedor.model';
import { CarritoService } from '../../services/carrito.service';
import { UtilsService } from '../../utils/utils.service';

@Component({
  selector: 'app-productos-item',
  templateUrl: './productos-item.component.html',
  styleUrls: ['./productos-item.component.scss']
})
export class ProductosItemComponent {
  @Input() productosListFiltrado: ProductoModel[] = [];
  @Input() providers: ProveedorModel[] = [];  
  constructor(public router: Router, private store: Store, public utils: UtilsService, public carritoService: CarritoService) {}

}
