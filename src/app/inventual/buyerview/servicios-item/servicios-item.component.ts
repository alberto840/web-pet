import { Component, Input, OnInit } from '@angular/core';
import { ServicioModel } from '../../models/producto.model';
import { ProveedorModel } from '../../models/proveedor.model';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { UtilsService } from '../../utils/utils.service';
import { CarritoService } from '../../services/carrito.service';
import { DialogAccessService } from '../../services/dialog-access.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-servicios-item',
  templateUrl: './servicios-item.component.html',
  styleUrls: ['./servicios-item.component.scss']
})
export class ServiciosItemComponent implements OnInit {
  cols!: Observable<number>;
  truncatedText!: Observable<number>;
  hightCols!: Observable<string>;
  @Input() serviciosListFiltrados: ServicioModel[] = [];
  @Input() providers: ProveedorModel[] = [];

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
  constructor(private breakpointObserver: BreakpointObserver, public router: Router, private store: Store, public utils: UtilsService, public carritoService: CarritoService, public dialogAccess: DialogAccessService) { }

}
