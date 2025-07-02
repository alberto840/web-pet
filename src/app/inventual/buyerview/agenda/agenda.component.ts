import { AfterViewInit, Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DialogAccessService } from '../../services/dialog-access.service';
import { ReservacionModel, ReservacionModelString, ServicioModel } from '../../models/producto.model';
import { ReservaState } from '../../state-management/reserva/reserva.state';
import { GetReserva } from '../../state-management/reserva/reserva.action';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { map, Observable, forkJoin } from 'rxjs';
import { UsuarioState } from '../../state-management/usuario/usuario.state';
import { ServicioState } from '../../state-management/servicio/servicio.state';
import { MascotaState } from '../../state-management/mascota/mascota.state';
import { HorarioState } from '../../state-management/horarioAtencion/horarioAtencion.state';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { format } from 'date-fns';
import { MascotaModel } from '../../models/mascota.model';
import { UsuarioModel } from '../../models/usuario.model';
import { CsvreportService } from '../../services/reportes/csvreport.service';
import { PdfreportService } from '../../services/reportes/pdfreport.service';
import { GetServicio } from '../../state-management/servicio/servicio.action';
import { GetUsuario } from '../../state-management/usuario/usuario.action';
import { UtilsService } from '../../utils/utils.service';
import { HorarioAtencionModel } from '../../models/horarios.model';
import { getMascota } from '../../state-management/mascota/mascote.action';
import { getHorarioAtencion } from '../../state-management/horarioAtencion/horarioAtencion.action';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AgendaComponent implements AfterViewInit, OnInit {
  isLoading$: Observable<boolean> = inject(Store).select(ReservaState.isLoading);
  isLoadingUsuarios$: Observable<boolean> = inject(Store).select(UsuarioState.isLoading);
  isLoadingServicios$: Observable<boolean> = inject(Store).select(ServicioState.isLoading);
  isLoadingMascotas$: Observable<boolean> = inject(Store).select(MascotaState.isLoading);
  isLoadingHorarios$: Observable<boolean> = inject(Store).select(HorarioState.isLoading);

  reservacion: ReservacionModel = {
    reservationId: 0,
    userId: 0,
    serviceId: 0,
    date: new Date(),
    status: '',
    availabilityId: 0,
    petId: 0
  };

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
  reservacionesCompletas: ReservacionModelString[] = [];

  // Table configuration
  displayedColumns: string[] = ['select', 'reservationId', 'userIdstring', 'serviceIdstring', 'dateString', 'status', 'availabilityIdstring', 'petIdstring', 'createdAt', 'accion'];
  dataSource: MatTableDataSource<ReservacionModelString> = new MatTableDataSource();
  selection = new SelectionModel<ReservacionModelString>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private store: Store,
    private _snackBar: MatSnackBar,
    private csv: CsvreportService,
    private pdf: PdfreportService,
    public dialogsService: DialogAccessService,
    public utils: UtilsService,
    private router: Router
  ) {
    this.reservaciones$ = this.store.select(ReservaState.getReservas);
    this.usuarios$ = this.store.select(UsuarioState.getUsuarios);
    this.servicios$ = this.store.select(ServicioState.getServicios);
    this.mascotas$ = this.store.select(MascotaState.getMascotas);
    this.horarios$ = this.store.select(HorarioState.getHorarios);
  }

  async ngOnInit(): Promise<void> {
    // Primero cargamos los datos básicos
    await this.cargarDatosIniciales();
    
    // Luego cargamos los horarios de atención específicos para cada servicio
    await this.cargarHorariosPorServicio();
    
    // Finalmente transformamos los datos
    await this.transformarYMostrarDatos();
  }

  private async cargarDatosIniciales(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.store.dispatch([
        new GetReserva(),
        new GetUsuario(),
        new GetServicio(),
        new getMascota()
      ]).subscribe(() => {
        // Obtenemos los datos cargados
        this.usuarios$.subscribe(usuarios => this.usuarios = usuarios);
        this.servicios$.subscribe(servicios => this.servicios = servicios);
        this.mascotas$.subscribe(mascotas => this.mascotas = mascotas);
        resolve();
      });
    });
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

  private async transformarYMostrarDatos(): Promise<void> {
    (await this.transformarDatosReservacionString()).subscribe(reservaciones => {
      this.reservacionesCompletas = reservaciones;
      this.dataSource.data = reservaciones;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit() {
    // La carga de datos ahora se maneja en ngOnInit
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Resto de los métodos permanecen igual...
  // (agregarReservacion, openSnackBar, aplicarFiltro, isAllSelected, toggleAllRows, checkboxLabel, generarPDF, generarCSV, applyFilter)

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
      `${format(new Date(horario.availableHour), 'dd/MM/yyyy')} ${horario.availableHour}` : 
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
          dateString: objeto.date ? format(new Date(objeto.date), 'dd/MM/yyyy HH:mm') : '',
          createdAt: objeto.createdAt ? new Date(objeto.createdAt) : undefined
        }))
      )
    )
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