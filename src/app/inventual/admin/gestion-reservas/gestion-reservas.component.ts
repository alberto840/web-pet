import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';
import { format } from 'date-fns';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { ProveedorModel, ProveedorModelString } from '../../models/proveedor.model';
import { UsuarioModel } from '../../models/usuario.model';
import { DialogAccessService } from '../../services/dialog-access.service';
import { CsvreportService } from '../../services/reportes/csvreport.service';
import { PdfreportService } from '../../services/reportes/pdfreport.service';
import { GetProveedor } from '../../state-management/proveedor/proveedor.action';
import { ProveedorState } from '../../state-management/proveedor/proveedor.state';
import { GetUsuario } from '../../state-management/usuario/usuario.action';
import { UsuarioState } from '../../state-management/usuario/usuario.state';
import { UtilsService } from '../../utils/utils.service';
import { ReservaState } from '../../state-management/reserva/reserva.state';
import { ReservacionModel, ReservacionModelString, ServicioModel } from '../../models/producto.model';
import { HorarioAtencionModel } from '../../models/horarios.model';
import { MascotaModel } from '../../models/mascota.model';
import { ServicioState } from '../../state-management/servicio/servicio.state';
import { HorarioState } from '../../state-management/horarioAtencion/horarioAtencion.state';
import { MascotaState } from '../../state-management/mascota/mascota.state';
import { GetServicio } from '../../state-management/servicio/servicio.action';
import { getHorarioAtencion } from '../../state-management/horarioAtencion/horarioAtencion.action';
import { getMascota } from '../../state-management/mascota/mascote.action';

@Component({
  selector: 'app-gestion-reservas',
  templateUrl: './gestion-reservas.component.html',
  styleUrls: ['./gestion-reservas.component.scss']
})
export class GestionReservasComponent implements AfterViewInit, OnInit, OnDestroy {
  isLoading$: Observable<boolean> = inject(Store).select(ReservaState.isLoading);
  usuarios: UsuarioModel[] = [];
  horariosMap: Map<number, HorarioAtencionModel> = new Map();

  reservas$: Observable<ReservacionModel[]>;
  servicios$: Observable<ServicioModel[]>;
  usuarios$: Observable<UsuarioModel[]>;
  mascotas$: Observable<MascotaModel[]>;

  reservas: ReservacionModel[] = [];
  servicios: ServicioModel[] = [];
  mascotas: MascotaModel[] = [];
  reservasString: ReservacionModelString[] = [];
  // Sidebar menu activation
  menuSidebarActive: boolean = false;

  private destroy$ = new Subject<void>();
  toggleSidebar() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  // Table configuration
  displayedColumns: string[] = ['select', 'userId', 'serviceId', 'availabilityId', 'petId', 'date', 'status', 'accion'];
  dataSource: MatTableDataSource<ReservacionModelString> = new MatTableDataSource();
  selection = new SelectionModel<ReservacionModelString>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store, private _snackBar: MatSnackBar, private csv: CsvreportService, private pdf: PdfreportService, public dialogsService: DialogAccessService, public utils: UtilsService) {
    this.reservas$ = this.store.select(ReservaState.getReservas);
    this.servicios$ = this.store.select(ServicioState.getServicios);
    this.usuarios$ = this.store.select(UsuarioState.getUsuarios);
    this.mascotas$ = this.store.select(MascotaState.getMascotas);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  ngAfterViewInit() {
    this.store.dispatch([new GetServicio(), new GetUsuario(), new getMascota()]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: ReservacionModelString): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.reservationId}`;
  }

  generarPDF() {
    const headers = [
      'Usuario',
      'Servicio',
      'Mascota',
      'Horario',
      'Fecha',
      'Estado',
    ];

    const fields: (keyof ReservacionModelString)[] = [
      'userIdstring',
      'serviceIdstring',
      'petIdstring',
      'availabilityIdstring',
      'date',
      'status',
    ];
    const seleccionados = this.selection.selected;
    this.pdf.generatePDF(
      seleccionados,
      headers,
      'Reporte_Reservas.pdf',
      fields,
      'Informe de Reservas generado: ' + new Date().toLocaleString(),
      'l', // Orientación vertical
      [400, 210]
    );
  }

  generarCSV() {
    const headers = [
      'Usuario',
      'Servicio',
      'Mascota',
      'Horario',
      'Fecha',
      'Estado',
    ];

    const fields: (keyof ReservacionModelString)[] = [
      'userIdstring',
      'serviceIdstring',
      'petIdstring',
      'availabilityIdstring',
      'date',
      'status',
    ];
    const seleccionados = this.selection.selected;
    this.csv.generateCSV(seleccionados, headers, 'Reporte_Reservas.csv', fields);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Emite un valor para desuscribirse
    this.destroy$.complete(); // Completa el Subject
  }

  async ngOnInit(): Promise<void> {
    this.store.dispatch([new GetServicio(), new GetUsuario(), new getMascota()]);
    this.reservas$
      .pipe(takeUntil(this.destroy$))
      .subscribe((reservas) => {
        reservas.forEach((reservas) => {
          this.store.dispatch([new getHorarioAtencion(reservas.availabilityId)]);
        });
        this.store.select(HorarioState.getHorarios)
          .pipe(takeUntil(this.destroy$))
          .subscribe((horarios) => {
            if (horarios && horarios.length) {
              // Clear the map first if needed
              this.horariosMap.clear();
              // Add all horarios to the map
              horarios.forEach(horario => {
                this.horariosMap.set(horario.availabilityId, horario);
              });
            }
          });

      });
    this.usuarios$.subscribe((usuarios) => {
      this.usuarios = usuarios;
    });
    this.servicios$.subscribe((servicios) => {
      this.servicios = servicios;
    });
    this.mascotas$.subscribe((mascotas) => {
      this.mascotas = mascotas;
    });
    (await this.transformarDatosReservaString()).subscribe((reserva) => {
      this.dataSource.data = reserva; // Asigna los datos al dataSource
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }

  getUserName(id: number): string {
    if (!this.usuarios.length) {
      return 'Cargando...'; // Si los roles aún no se han cargado
    }
    const usuario = this.usuarios.find((r) => r.userId === id);
    return usuario ? usuario.name : 'Sin usuario';  // Devuelve el nombre del rol o "Sin Rol" si no se encuentra
  }
  getServiceName(id: number): string {
    if (!this.servicios.length) {
      return 'Cargando...'; // Si los roles aún no se han cargado
    }
    const servicio = this.servicios.find((r) => r.serviceId === id);
    return servicio ? servicio.serviceName : 'Sin servicio';  // Devuelve el nombre del rol o "Sin Rol" si no se encuentra
  }
  getPetName(id: number): string {
    if (!this.mascotas.length) {
      return 'Cargando...'; // Si los roles aún no se han cargado
    }
    const mascota = this.mascotas.find((r) => r.petId === id);
    return mascota ? mascota.petName : 'Sin mascota';  // Devuelve el nombre del rol o "Sin Rol" si no se encuentra
  }
  getHorarioAtencion(id: number): string {
    if (!this.horariosMap) {
      return 'Cargando...'; // Si los roles aún no se han cargado
    }
    const horario = this.horariosMap.get(id);
    return horario ? horario.availableHour : 'Sin horario';  // Devuelve el nombre del rol o "Sin Rol" si no se encuentra
  }

  async transformarDatosReservaString() {
    const listaActual$: Observable<ReservacionModel[]> = this.reservas$;
    const listaModificada$: Observable<ReservacionModelString[]> = listaActual$.pipe(
      map((objetos: ReservacionModel[]) =>
        objetos.map((objeto: ReservacionModel) => ({
          reservationId: objeto.reservationId,
          userId: objeto.userId,
          serviceId: objeto.serviceId,
          availabilityId: objeto.availabilityId,
          petId: objeto.petId,
          date: objeto.date,
          status: objeto.status,
          userIdstring: this.getUserName(objeto.userId),
          serviceIdstring: this.getServiceName(objeto.serviceId),
          petIdstring: this.getPetName(objeto.petId),
          availabilityIdstring: this.getHorarioAtencion(objeto.availabilityId),
          dateString: objeto.date ? format(new Date(objeto.date), 'dd/MM/yyyy HH:mm:ss') : '',
        }))
      )
    );
    return listaModificada$;
  }
}
