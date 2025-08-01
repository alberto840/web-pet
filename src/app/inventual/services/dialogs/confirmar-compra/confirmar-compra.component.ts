import { Component, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ProductoModel, ServicioModel, TransaccionModel } from 'src/app/inventual/models/producto.model';
import { TransactionHistoryState } from 'src/app/inventual/state-management/transaccion/transaccion.state';
import { CarritoService } from '../../carrito.service';
import { AddTransaccion } from 'src/app/inventual/state-management/transaccion/transaccion.action';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogAccessService } from '../../dialog-access.service';
import { UsuarioModel } from 'src/app/inventual/models/usuario.model';

@Component({
  selector: 'app-confirmar-compra',
  templateUrl: './confirmar-compra.component.html',
  styleUrls: ['./confirmar-compra.component.scss']
})
export class ConfirmarCompraComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  map!: google.maps.Map;
  marker!: google.maps.marker.AdvancedMarkerElement;
  async initMap(): Promise<void> {
    const defaultCoords = { lat: -17.7833, lng: -63.1821 };

    const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    this.map = new Map(this.mapContainer.nativeElement, {
      center: defaultCoords,
      zoom: 14,
      disableDefaultUI: true,
      mapId: 'DEMO_MAP_ID',
    });

    // Crea y agrega el nuevo marker
    this.marker = new AdvancedMarkerElement({
      position: defaultCoords,
      map: this.map,
      title: "Tu ubicación"
    });

    // Manejar clics en el mapa
    this.map.addListener("click", (e: google.maps.MapMouseEvent) => {
      const latLng = e.latLng;
      if (latLng) {
        this.marker.position = latLng;
        this.ubicacionSeleccionada = `${latLng.lat()},${latLng.lng()}`;
      }
    });

    this.ubicacionSeleccionada = `${defaultCoords.lat},${defaultCoords.lng}`;
  }

  ubicacionSeleccionada: string = '';

  userId: string = localStorage.getItem('userId') || '';
  isLoading$: Observable<boolean> = inject(Store).select(TransactionHistoryState.isLoading);
  servicios$: Observable<ServicioModel[]>;
  servicios: ServicioModel[] = [];

  productos$: Observable<ProductoModel[]>;
  productos: ProductoModel[] = [];
  transaccionServ: TransaccionModel = {
    totalAmount: 0,
    status: "PENDIENTE",
    userId: 0,
    serviceId: 0,
    amountPerUnit: 0,
    quantity: 0,
    service: {} as ServicioModel,
    user: {} as UsuarioModel,
    product: {} as ProductoModel,
  }
  transaccionProd: TransaccionModel = {
    totalAmount: 0,
    status: "PENDIENTE",
    userId: 0,
    productId: 0,
    amountPerUnit: 0,
    quantity: 0,
    service: {} as ServicioModel,
    user: {} as UsuarioModel,
    product: {} as ProductoModel,
  }

  constructor(private dialogRef: MatDialogRef<ConfirmarCompraComponent>, private router: Router, public store: Store, public carrito: CarritoService, private _snackBar: MatSnackBar, private carritoService: CarritoService, public dialogAccesService: DialogAccessService) {
    this.servicios$ = this.store.select(state => state.carrito.servicios);
    this.productos$ = this.store.select(state => state.carrito.productos);
  }
  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 500);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
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

  async registrarTransaccion() {
    if (this.servicios.length === 0 && this.productos.length === 0) {
      this.openSnackBar('No hay productos ni servicios en el carrito', 'Cerrar');
      return;
    }
    await this.recorrerProductos(this.productos);
    await this.recorrerServicios(this.servicios);
    this.dialogRef.close();
    this.dialogAccesService.afterCompra();
    this.carritoService.vaciarCarrito();
  }

  recorrerProductos(productos: ProductoModel[]) {
    this.transaccionProd.userId = this.userId ? parseInt(this.userId) : 0;
    productos.forEach((producto) => {
      this.transaccionProd.productId = producto.productId ?? 1;
      this.transaccionProd.totalAmount = producto.cantidad ?? 1;
      this.store.dispatch(new AddTransaccion(this.transaccionProd)).subscribe({
        next: () => {
          this.openSnackBar('Transaccion producto registrada correctamente', 'Cerrar');
        },
        error: (error) => {
          console.error('Error al registrar transaccion producto:', error);
          this.openSnackBar('Error en el registro, vuelve a intentarlo', 'Cerrar');
        },
      });
    });
  }

  recorrerServicios(servicios: ServicioModel[]) {
    this.transaccionServ.userId = this.userId ? parseInt(this.userId) : 0;
    servicios.forEach((servicios) => {
      this.transaccionServ.serviceId = servicios.serviceId ?? 1;
      this.transaccionServ.totalAmount = servicios.cantidad ?? 1;
      for (let i = 0; i < (servicios.cantidad ?? 1); i++) {
        this.store.dispatch(new AddTransaccion(this.transaccionServ)).subscribe({
          next: () => {
            this.openSnackBar('Transaccion servicio registrada correctamente', 'Cerrar');
          },
          error: (error) => {
            console.error('Error al registrar transaccion servicio:', error);
            this.openSnackBar('Error en el registro, vuelve a intentarlo', 'Cerrar');
          },
        });
      }
    });
  }


}
