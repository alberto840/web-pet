import { Component, Input } from '@angular/core';
import { ServicioModel } from '../../models/producto.model';
import { ProveedorModel } from '../../models/proveedor.model';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { UtilsService } from '../../utils/utils.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-servicios-item',
  templateUrl: './servicios-item.component.html',
  styleUrls: ['./servicios-item.component.scss']
})
export class ServiciosItemComponent {
  @Input() serviciosListFiltrados: ServicioModel[] = [];
  @Input() providers: ProveedorModel[] = [];  
  constructor(public router: Router, private store: Store, public utils: UtilsService, public carritoService: CarritoService) {}

}
