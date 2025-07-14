import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { DialogAccessService } from '../../services/dialog-access.service';
import { CsvreportService } from '../../services/reportes/csvreport.service';
import { PdfreportService } from '../../services/reportes/pdfreport.service';
import { UtilsService } from '../../utils/utils.service';
import { ReservacionModel, ReservacionModelString, ServicioModel } from '../../models/producto.model';
import { ReservaByProviderState } from '../../state-management/reserva/reservaByProvider.state';
import { Router } from '@angular/router';
import { GetReserva, GetReservasByProvider } from '../../state-management/reserva/reserva.action';
import { CarritoService } from '../../services/carrito.service';
import { ResenaState } from '../../state-management/resena/resena.state';
import { ReservaState } from '../../state-management/reserva/reserva.state';

@Component({
  selector: 'app-gestion-reservas',
  templateUrl: './gestion-reservas.component.html',
  styleUrls: ['./gestion-reservas.component.scss']
})
export class GestionReservasComponent implements AfterViewInit, OnInit, OnDestroy {
  providerId = localStorage.getItem('providerId');
  serviciosMap: Map<number, ServicioModel> = new Map();
  displayedColumns: string[] = ['select', 'imagen', 'petId', 'status', 'userId', 'createdAt', 'date', 'availabilityId', 'action'];
  dataSource: MatTableDataSource<ReservacionModel> = new MatTableDataSource(); // Cambiado el tipo a `any`
  selection = new SelectionModel<ReservacionModel>(true, []);

  reservaciones$: Observable<ReservacionModel[]>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  isLoading$: Observable<boolean> = inject(Store).select(ReservaByProviderState.isLoading);

  private destroy$ = new Subject<void>();

  constructor(public router: Router, private store: Store, private csv: CsvreportService, private pdf: PdfreportService, public dialogAccess: DialogAccessService, private _snackBar: MatSnackBar, public carritoService: CarritoService, public utils: UtilsService, public dialogsService: DialogAccessService) {
    this.reservaciones$ = this.store.select(ReservaState.getReservas);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async ngOnInit(): Promise<void> {
    this.store.dispatch([new GetReserva(),
    ]);
    this.reservaciones$.subscribe((reservas) => {
      this.dataSource.data = reservas;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit() {
    this.store.dispatch([
      new GetReservasByProvider(this.providerId ? parseInt(this.providerId) : 0)]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
  checkboxLabel(row?: ReservacionModel): string {
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

  generarPDF() {
    const headers = [
      'Usuario',
      'Servicio',
      'Disponibilidad',
      'Mascota',
      'Fecha',
    ];

    const fields: (keyof ReservacionModel)[] = [
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

    const fields: (keyof ReservacionModel)[] = [
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
