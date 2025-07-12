import { AfterViewInit, Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProductoModel, ReservacionModel, ReservacionModelString, ServicioModel } from '../../models/producto.model';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';
import { DialogAccessService } from '../../services/dialog-access.service';
import { CsvreportService } from '../../services/reportes/csvreport.service';
import { PdfreportService } from '../../services/reportes/pdfreport.service';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { ServicioState } from '../../state-management/servicio/servicio.state';
import { GetUsuario } from '../../state-management/usuario/usuario.action';
import { UsuarioState } from '../../state-management/usuario/usuario.state';
import { UtilsService } from '../../utils/utils.service';
import { ReservaByProviderState } from '../../state-management/reserva/reservaByProvider.state';
import { GetReservasByProvider } from '../../state-management/reserva/reserva.action';
import { GetServicio, GetServicioById } from '../../state-management/servicio/servicio.action';
import { getMascota } from '../../state-management/mascota/mascote.action';
import { GetProductoById } from '../../state-management/producto/producto.action';
import { UsuarioModel } from '../../models/usuario.model';
import { MascotaModel } from '../../models/mascota.model';
import { HorarioAtencionModel } from '../../models/horarios.model';
import { MascotaState } from '../../state-management/mascota/mascota.state';
import { HorarioState } from '../../state-management/horarioAtencion/horarioAtencion.state';
import { CarritoService } from '../../services/carrito.service';
import { ServiceByIdState } from '../../state-management/servicio/servicioById.state';
import { getHorarioAtencion } from '../../state-management/horarioAtencion/horarioAtencion.action';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReservasComponent implements AfterViewInit, OnInit {
  providerId = localStorage.getItem('providerId');
  serviciosMap: Map<number, ServicioModel> = new Map();
  displayedColumns: string[] = ['select', 'imagen', 'petId', 'status', 'userId', 'createdAt', 'date', 'availabilityId', 'action'];
  dataSource: MatTableDataSource<ReservacionModelString> = new MatTableDataSource(); // Cambiado el tipo a `any`
  selection = new SelectionModel<ReservacionModelString>(true, []);

  reservaciones$: Observable<ReservacionModel[]>;
  usuarios$: Observable<UsuarioModel[]>;
  servicios$: Observable<ServicioModel[]>;
  mascotas$: Observable<MascotaModel[]>;
  horarios$: Observable<HorarioAtencionModel[]>;

  // Datos locales para búsquedas
  usuarios: UsuarioModel[] = [];
  servicios: ServicioModel[] = [];
  mascotas: MascotaModel[] = [];
  horarios: HorarioAtencionModel[] = [];
  reservaciones: ReservacionModel[] = [];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  isLoading$: Observable<boolean> = inject(Store).select(ReservaByProviderState.isLoading);

  private destroy$ = new Subject<void>();

  constructor(public router: Router, private store: Store, private csv: CsvreportService, private pdf: PdfreportService, public dialogAccess: DialogAccessService, private _snackBar: MatSnackBar, public carritoService: CarritoService, public utils: UtilsService, public dialogsService: DialogAccessService) {
    this.reservaciones$ = this.store.select(ReservaByProviderState.getReservasByProvider);
    this.usuarios$ = this.store.select(UsuarioState.getUsuarios);
    this.servicios$ = this.store.select(ServicioState.getServicios);
    this.mascotas$ = this.store.select(MascotaState.getMascotas);
    this.horarios$ = this.store.select(HorarioState.getHorarios);
  }
  ngOnDestroy(): void {
    this.destroy$.next(); // Emite un valor para desuscribirse
    this.destroy$.complete(); // Completa el Subject
  }

  async ngOnInit(): Promise<void> {
    this.store.dispatch([new GetReservasByProvider(this.providerId ? parseInt(this.providerId) : 0),
    new GetUsuario(),
    new GetServicio(),
    new getMascota(),
  ]);
    this.usuarios$.subscribe((usuarios) => {
      this.usuarios = usuarios;
    });
    this.servicios$.subscribe((servicios) => {
      this.servicios = servicios;
    });
    this.mascotas$.subscribe((mascotas) => {
      this.mascotas = mascotas;
    });
    this.horarios$.subscribe((horarios) => {
      this.horarios = horarios;
    });
    this.reservaciones$
      .pipe(takeUntil(this.destroy$))
      .subscribe((reservas) => {
        this.reservaciones = reservas;
        reservas.forEach((reserva) => {
          if (reserva.serviceId) {
            this.store.dispatch([new GetServicioById(reserva.serviceId)]);
          }
        });

        this.store.select(ServiceByIdState.getServiceById)
          .pipe(takeUntil(this.destroy$))
          .subscribe((servicio) => {
            if (servicio) {
              this.serviciosMap.set((servicio.serviceId ?? 0), servicio);
            }
          });
      });

    (await this.transformarDatosReservacionString()).subscribe((reservas) => {
      this.dataSource.data = reservas; // Asigna los datos al dataSource
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit() {
    this.store.dispatch([
      new GetReservasByProvider(this.providerId ? parseInt(this.providerId) : 0),
      new GetUsuario(),
      new GetServicio(),
      new getMascota()]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private async cargarHorariosPorServicio(): Promise<void> {
    return new Promise<void>((resolve) => {
      // Obtenemos todos los servicios únicos de las reservaciones
      this.reservaciones$.subscribe(reservaciones => {
        const serviciosUnicos = [...new Set(reservaciones.map(r => r.serviceId))];
        
        // Disparamos acciones para obtener horarios de cada servicio
        const acciones = serviciosUnicos.map(serviceId => 
          new getHorarioAtencion(serviceId)
        );
        
        if (acciones.length > 0) {
          this.store.dispatch(acciones).subscribe(() => {
            this.horarios$.subscribe(horarios => this.horarios = horarios);
            resolve();
          });
        } else {
          resolve();
        }
      });
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ReservacionModelString): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    const reservaId = row.reservationId ?? 0;
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${reservaId + 1}`;
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
  getUsuarioName(id: number): string {
    if (!this.usuarios.length) return 'Cargando...';
    const usuario = this.usuarios.find(u => u.userId === id);
    return usuario ? usuario.name : 'Usuario no encontrado';
  }

  getServicioName(id: number): string {
    if (!this.servicios.length) return 'Cargando...';
    const servicio = this.servicios.find(s => s.serviceId === id);
    return servicio ? servicio.serviceName : 'Servicio no encontrado';
  }

  getMascotaName(id: number): string {
    if (!this.mascotas.length) return 'Cargando...';
    const mascota = this.mascotas.find(m => m.petId === id);
    return mascota ? mascota.petName : 'Mascota no encontrada';
  }

  getMascotaImgUrl(id: number): string {
    if (!this.mascotas.length) return 'assets/images/placeholder.png';
    const mascota = this.mascotas.find(m => m.petId === id);
    return mascota ? mascota.imageUrl || 'assets/images/placeholder.png' : 'assets/images/placeholder.png';
  }

  getHorarioInfo(id: number): string {
    if (!this.horarios.length) return 'Cargando...';
    const horario = this.horarios.find(h => h.availabilityId === id);
    return horario ?
      `${horario.availableHour}` :
      'Horario no encontrado';
  }

  getProviderIdByServiceId(serviceId: number): number {
    const servicio = this.servicios.find(s => s.serviceId === serviceId);
    return servicio ? servicio.providerId : 0;
  }

  getTipoAtencionByServiceId(serviceId: number): string {
    const servicio = this.servicios.find(s => s.serviceId === serviceId);
    return servicio ? servicio.tipoAtencion : 'Tipo de atención no encontrado';
  }

  getProviderNameByServiceId(serviceId: number): string {
    const providerId = this.getProviderIdByServiceId(serviceId);
    const usuario = this.usuarios.find(u => u.userId === providerId);
    return usuario ? usuario.name : 'Proveedor no encontrado';
  }

  async transformarDatosReservacionString(): Promise<Observable<ReservacionModelString[]>> {
    const listaActual$: Observable<ReservacionModel[]> = this.reservaciones$;

    return listaActual$.pipe(
      map((objetos: ReservacionModel[]) =>
        objetos.map((objeto: ReservacionModel) => ({
          ...objeto,
          userIdstring: this.getUsuarioName(objeto.userId),
          serviceIdstring: this.getServicioName(objeto.serviceId),
          availabilityIdstring: this.getHorarioInfo(objeto.availabilityId),
          petIdstring: this.getMascotaName(objeto.petId),
          dateString: objeto.date ? format(new Date(objeto.date), 'dd MMMM yyyy') : '',
          createdAt: objeto.createdAt ? new Date(objeto.createdAt) : undefined
        }))
      )
    )
  }
  getServiceName(id: number): string {
    const servicio = this.serviciosMap.get(id);
    return servicio ? servicio.serviceName : 'Sin servicio';
  }
  getUserPhone(id: number): string {
    if (!this.usuarios.length) {
      return 'Cargando...'; // Si los roles aún no se han cargado
    }
    const usuario = this.usuarios.find((r) => r.userId === id);
    return usuario ? usuario.phoneNumber : 'Sin usuario';
  }

  generarPDF() {
    const headers = [
      'Usuario',
      'Servicio',
      'Disponibilidad',
      'Mascota',
      'Fecha',
    ];

    const fields: (keyof ReservacionModelString)[] = [
      'userId',
      'serviceId',
      'availabilityId',
      'petId',
      'date',
      'status',
    ];
    const seleccionados = this.selection.selected;
    this.pdf.generatePDF(
      seleccionados,
      headers,
      'Reporte_Productos.pdf',
      fields,
      'Informe de Productos generado: ' + new Date().toLocaleString(),
      'l' // Orientación vertical
    );
  }

  generarCSV() {
    const seleccionados = this.selection.selected;
    const headers = [
      'Usuario',
      'Servicio',
      'Disponibilidad',
      'Mascota',
      'Fecha',
    ];

    const fields: (keyof ReservacionModelString)[] = [
      'userId',
      'serviceId',
      'availabilityId',
      'petId',
      'date',
      'status',
    ];
    this.csv.generateCSV(seleccionados, headers, 'Reporte_Productos.csv', fields);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

}