import { Component, OnDestroy, OnInit } from '@angular/core';
import { ServicioModel } from '../../models/producto.model';
import { ProveedorModel } from '../../models/proveedor.model';
import { CategoriaModel } from '../../models/categoria.model';
import { GetServicioById } from '../../state-management/servicio/servicio.action';
import { ServiceByIdState } from '../../state-management/servicio/servicioById.state';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Subject, Observable, takeUntil } from 'rxjs';
import { getCategorias } from '../../state-management/categoria/categoria.action';
import { CategoriaState } from '../../state-management/categoria/categoria.state';
import { GetProveedorById } from '../../state-management/proveedor/proveedor.action';
import { ProviderByIdState } from '../../state-management/proveedor/proveedorById.state';
import { UtilsService } from '../../utils/utils.service';
import { DialogAccessService } from '../../services/dialog-access.service';

@Component({
  selector: 'app-servicio-detalle',
  templateUrl: './servicio-detalle.component.html',
  styleUrls: ['./servicio-detalle.component.scss']
})
export class ServicioDetalleComponent implements OnInit, OnDestroy {
  servicioId: number = 0;
  private destroy$ = new Subject<void>();
  servicio: ServicioModel = {
    serviceName: '',
    price: 0,
    duration: 0,
    description: '',
    status: false,
    providerId: 0,
    imageId: null,
    tipoAtencion: '',
    categoryId: 0,
    onSale: false,
  }
  proveedor: ProveedorModel = {
    name: '',
    description: '',
    address: '',
    userId: 0,
    rating: 0,
    status: false
  }
  categoria: CategoriaModel = {
    nameCategory: '',
    icono: ''
  }
  categorias$: Observable<CategoriaModel[]>;
  categorias: CategoriaModel[] = [];

  constructor(private route: ActivatedRoute, public router: Router, private store: Store, public utils: UtilsService, public dialogAccess: DialogAccessService) {
    this.categorias$ = this.store.select(CategoriaState.getCategorias);
   }
  ngOnInit(): void {
    this.store.dispatch([new getCategorias()]);
    this.categorias$.pipe(takeUntil(this.destroy$)).subscribe((categorias) => {
      this.categorias = categorias;
    });
    this.route.params.subscribe(params => {
      this.servicioId = params['id'];
      this.obtenerServicio();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Emite un valor para desuscribirse
    this.destroy$.complete(); // Completa el Subject
  }

  obtenerServicio() {
    this.store.dispatch([new GetServicioById(this.servicioId)]);
    this.store.select(ServiceByIdState.getServiceById)
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (servicio) => {
        if (servicio) {
          this.servicio = servicio;
          await this.obtenerProvider();
        }
      });
  }

  async obtenerProvider(){    
    this.store.dispatch([new GetProveedorById(this.servicio.providerId)]);
    this.store.select(ProviderByIdState.getProveedorById)
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (proveedor) => {
        if (proveedor) {
          this.proveedor = proveedor;
        }
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
