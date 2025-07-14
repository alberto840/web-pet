import { AfterViewInit, Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DialogAccessService } from '../../services/dialog-access.service';
import { ReservacionModel, ServicioModel } from '../../models/producto.model';
import { GetReservasByUser } from '../../state-management/reserva/reserva.action';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MascotaModel } from '../../models/mascota.model';
import { UsuarioModel } from '../../models/usuario.model';
import { CsvreportService } from '../../services/reportes/csvreport.service';
import { PdfreportService } from '../../services/reportes/pdfreport.service';
import { GetServicio } from '../../state-management/servicio/servicio.action';
import { GetUsuario } from '../../state-management/usuario/usuario.action';
import { UtilsService } from '../../utils/utils.service';
import { HorarioAtencionModel } from '../../models/horarios.model';
import { getMascota } from '../../state-management/mascota/mascote.action';
import { ReservaByUserState } from '../../state-management/reserva/reservaByUser.state';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AgendaComponent implements AfterViewInit, OnInit {
  serviciosMap: Map<number, ServicioModel> = new Map();
  userid = localStorage.getItem('userId');
  isLoading$: Observable<boolean> = inject(Store).select(ReservaByUserState.isLoading);

  reservacion: ReservacionModel = {
    userId: 0,
    user: {} as UsuarioModel,
    serviceId: 0,
    service: {} as ServicioModel,
    date: new Date(),
    status: '',
    availabilityId: 0,
    availability: {} as HorarioAtencionModel,
    petId: 0,
    pet: {} as MascotaModel,
  };

  reservaciones$: Observable<ReservacionModel[]>;

  // Table configuration
  displayedColumns: string[] = ['select', 'reservationId', 'userId', 'serviceId', 'date', 'status', 'availabilityId', 'petId', 'createdAt', 'accion'];
  dataSource: MatTableDataSource<ReservacionModel> = new MatTableDataSource();
  selection = new SelectionModel<ReservacionModel>(true, []);

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
    this.reservaciones$ = this.store.select(ReservaByUserState.getReservasByUser);
  }

  async ngOnInit(): Promise<void> {
    // Primero cargamos los datos básicos
    await this.cargarDatosIniciales();
    this.reservaciones$.subscribe((reservaciones) => {
      this.dataSource.data = reservaciones;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  private async cargarDatosIniciales() {
    this.store.dispatch([new GetReservasByUser(this.userid ? parseInt(this.userid) : 0)]);

  }

  ngAfterViewInit() {
    // La carga de datos ahora se maneja en ngOnInit
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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