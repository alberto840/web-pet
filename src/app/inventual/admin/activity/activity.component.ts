import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivityLogState } from '../../state-management/actividad/actividad.state';
import { ActividadesModel, ActividadesModelString } from '../../models/actividades.model';
import { getActividad } from '../../state-management/actividad/actividad.action';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';
import { Observable, map } from 'rxjs';
import { UsuarioModel } from '../../models/usuario.model';
import { DialogAccessService } from '../../services/dialog-access.service';
import { CsvreportService } from '../../services/reportes/csvreport.service';
import { PdfreportService } from '../../services/reportes/pdfreport.service';
import { GetUsuario } from '../../state-management/usuario/usuario.action';
import { UsuarioState } from '../../state-management/usuario/usuario.state';
import { UtilsService } from '../../utils/utils.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements AfterViewInit, OnInit {
  isLoading$: Observable<boolean> = inject(Store).select(ActivityLogState.isLoading);
  isLoadinguser$: Observable<boolean> = inject(Store).select(UsuarioState.isLoading);
  actividad: ActividadesModel = {
    activityLogsId: 0,
    userId: 0,
    action: '',
    description: '',
    ip: '',
    createdAt: new Date()
  };

  actividades$: Observable<ActividadesModel[]>;
  usuarios$: Observable<UsuarioModel[]>;

  // Sidebar menu activation
  menuSidebarActive: boolean = false;
  myfunction() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }
  toggleSidebar() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Table configuration
  displayedColumns: string[] = ['select', 'userId', 'action', 'description', 'ip', 'createdAt', 'action2'];
  dataSource: MatTableDataSource<ActividadesModelString> = new MatTableDataSource();
  selection = new SelectionModel<ActividadesModelString>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store, private _snackBar: MatSnackBar, private csv: CsvreportService, private pdf: PdfreportService, public dialogsService: DialogAccessService, public utils: UtilsService) {
    this.actividades$ = this.store.select(ActivityLogState.getActivityLogs);
    this.usuarios$ = this.store.select(UsuarioState.getUsuarios);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  ngAfterViewInit() {
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

  checkboxLabel(row?: ActividadesModelString): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.activityLogsId}`;
  }

  generarPDF() {
    const seleccionados = this.selection.selected;
    const headers = [
      'Actividad Id',
      'Usuario',
      'Accion',
      'Descripcion',
      'IP',
      'Creado',
    ];

    const fields: (keyof ActividadesModelString)[] = [
      'activityLogsId',
      'userIdstring',
      'action',
      'description',
      'ip',
      'createdAtstring',
    ];
    this.pdf.generatePDF(
      seleccionados,
      headers,
      'Reporte_Actividades.pdf',
      fields,
      'Informe de Tickets generado: ' + new Date().toLocaleString(),
      'l' // Orientación vertical
    );
  }

  generarCSV() {
    const seleccionados = this.selection.selected;
    //this.csv.ticketsCSV(seleccionados);
    const headers = [
      'Actividad Id',
      'Usuario',
      'Accion',
      'Descripcion',
      'IP',
      'Creado',
    ];

    const fields: (keyof ActividadesModelString)[] = [      
      'activityLogsId',
      'userIdstring',
      'action',
      'description',
      'ip',
      'createdAtstring',
    ];
    this.csv.generateCSV(seleccionados, headers, 'Reporte_Actividades.csv', fields);
  }

  async ngOnInit(): Promise<void> {
    // Despacha la acción para obtener los tickets
    this.store.dispatch([new getActividad(), new GetUsuario()]);

    (await this.transformarDatosActividadesString()).subscribe((usuario) => {
      this.dataSource.data = usuario; // Asigna los datos al dataSource
    });
    this.usuarios$.subscribe((usuarios) => {
      this.usuarios = usuarios;
    });
  }

  usuarios: UsuarioModel[] = [];
  getUserName(id: number): string {
    if (!this.usuarios.length) {
      this.store.dispatch([new getActividad(), new GetUsuario()]);
      return 'Cargando...'; // Si los roles aún no se han cargado
    }
    const usuario = this.usuarios.find((r) => r.userId === id);
    return usuario ? usuario.name : 'Sin usuario';  // Devuelve el nombre del rol o "Sin Rol" si no se encuentra
  }

  async transformarDatosActividadesString() {
    const listaActual$: Observable<ActividadesModel[]> = this.actividades$;
    const listaModificada$: Observable<ActividadesModelString[]> = listaActual$.pipe(
      map((objetos: ActividadesModel[]) =>
        objetos.map((objeto: ActividadesModel) => ({
          ...objeto,
          userIdstring: this.getUserName(objeto.userId),
          createdAtstring: objeto.createdAt ? format(new Date(objeto.createdAt), 'dd/MM/yyyy HH:mm:ss') : '',
        }))
      )
    );
    return listaModificada$;
  }
}
