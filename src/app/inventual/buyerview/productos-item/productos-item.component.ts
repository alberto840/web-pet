import { Component, Input, OnInit } from '@angular/core';
import { ProductoModel } from '../../models/producto.model';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ProveedorModel } from '../../models/proveedor.model';
import { CarritoService } from '../../services/carrito.service';
import { UtilsService } from '../../utils/utils.service';
import { Observable, map } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-productos-item',
  templateUrl: './productos-item.component.html',
  styleUrls: ['./productos-item.component.scss']
})
export class ProductosItemComponent implements OnInit {
  cols!: Observable<number>;
  truncatedText!: Observable<number>;
  hightCols!: Observable<string>;
  @Input() productosListFiltrado: ProductoModel[] = [];
  @Input() providers: ProveedorModel[] = [];
  constructor(private breakpointObserver: BreakpointObserver, public router: Router, private store: Store, public utils: UtilsService, public carritoService: CarritoService) { }
  ngOnInit(): void {
    this.cols = this.breakpointObserver.observe([
      '(max-width: 575px)',
      '(max-width: 767px)',
      '(min-width: 768px) and (max-width: 991px)'
    ]).pipe(
      map(({ matches }) => {
        if (matches) {
          return 2;
        }
        return 5;
      })
    );

    this.hightCols = this.breakpointObserver.observe([
      '(max-width: 575px)',
      '(max-width: 767px)',
      '(min-width: 768px) and (max-width: 991px)'
    ]).pipe(
      map(({ matches }) => {
        if (matches) {
          return '32:45';
        }
        return '32:33';
      })
    );

    this.truncatedText = this.breakpointObserver.observe([
      '(max-width: 575px)',
      '(max-width: 767px)',
      '(min-width: 768px) and (max-width: 991px)'
    ]).pipe(
      map(({ matches }) => {
        if (matches) {
          return 7;
        }
        return 9;
      })
    );
  }

}
