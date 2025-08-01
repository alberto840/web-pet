import { AfterViewInit, Component, ElementRef, Inject, inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ReservacionModel, ServicioModel } from 'src/app/inventual/models/producto.model';
import { ReservaState } from 'src/app/inventual/state-management/reserva/reserva.state';
import { CarritoService } from '../../carrito.service';
import { DialogAccessService } from '../../dialog-access.service';
import { ConfirmarCompraComponent } from '../confirmar-compra/confirmar-compra.component';
import { AddReserva } from 'src/app/inventual/state-management/reserva/reserva.action';

@Component({
  selector: 'app-servicio-ubicacion',
  templateUrl: './servicio-ubicacion.component.html',
  styleUrls: ['./servicio-ubicacion.component.scss']
})
export class ServicioUbicacionComponent implements AfterViewInit {
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
  isLoading$: Observable<boolean> = inject(Store).select(ReservaState.isLoading);
  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 500);
  }

  servicio: ServicioModel = {
    serviceName: '',
    price: 0,
    duration: 0,
    description: '',
    status: true,
    providerId: 0,
    imageId: null,
    tipoAtencion: '',
    categoryId: 0,
    onSale: false
  };

  reserva: ReservacionModel = {
    userId: 0,
    serviceId: 0,
    date: new Date(),
    status: 'PENDIENTE',
    availabilityId: 0,
    petId: 0
  };

  constructor(@Inject(MAT_DIALOG_DATA) public datosreserva: ReservacionModel, private dialogRef: MatDialogRef<ServicioUbicacionComponent>, private router: Router, public store: Store, public carrito: CarritoService, private _snackBar: MatSnackBar, private carritoService: CarritoService, public dialogAccesService: DialogAccessService) {
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  async registrarReserva() {
    if (!this.ubicacionSeleccionada) {
      this.openSnackBar('Por favor selecciona una ubicación en el mapa', 'Cerrar');
      return;
    }
    await this.crearReserva();
    this.dialogRef.close();
    this.dialogAccesService.afterAgendar();
  }

  async crearReserva() {
    this.store.dispatch(new AddReserva(this.datosreserva)).subscribe({
      next: () => {
        console.log('reserva registrado correctamente:', this.datosreserva);
        this.openSnackBar('Servicio agendado y agregado al carrito', 'Cerrar');
        this.dialogRef.close();
      },
      error: (error) => {
        console.error('Error al registrar Servicio:', error);
        this.openSnackBar('Error en el registro, vuelve a intentarlo', 'Cerrar');
      },
    });
  }

}
