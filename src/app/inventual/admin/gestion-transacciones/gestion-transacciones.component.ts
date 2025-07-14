import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, inject, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, Subject, takeUntil, map } from 'rxjs';
import { ServicioModel, ProductoModel, TransaccionModelString, TransaccionModel } from '../../models/producto.model';
import { UsuarioModel } from '../../models/usuario.model';
import { CarritoService } from '../../services/carrito.service';
import { DialogAccessService } from '../../services/dialog-access.service';
import { CsvreportService } from '../../services/reportes/csvreport.service';
import { PdfreportService } from '../../services/reportes/pdfreport.service';
import { GetProductoById } from '../../state-management/producto/producto.action';
import { ProductoState } from '../../state-management/producto/producto.state';
import { ProductByIdState } from '../../state-management/producto/productoById.state';
import { GetServicioById } from '../../state-management/servicio/servicio.action';
import { ServicioState } from '../../state-management/servicio/servicio.state';
import { ServiceByIdState } from '../../state-management/servicio/servicioById.state';
import { GetTransaccion, GetTransaccionByProvider } from '../../state-management/transaccion/transaccion.action';
import { TransactionHistoryState } from '../../state-management/transaccion/transaccion.state';
import { GetUsuario } from '../../state-management/usuario/usuario.action';
import { UsuarioState } from '../../state-management/usuario/usuario.state';
import { UtilsService } from '../../utils/utils.service';

@Component({
  selector: 'app-gestion-transacciones',
  templateUrl: './gestion-transacciones.component.html',
  styleUrls: ['./gestion-transacciones.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class GestionTransaccionesComponent implements AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['select', 'imagen', 'totalAmount', 'status', 'userId', 'createdAt', 'action'];
  dataSource: MatTableDataSource<TransaccionModel> = new MatTableDataSource(); // Cambiado el tipo a `any`
  selection = new SelectionModel<TransaccionModel>(true, []);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  userId: string = localStorage.getItem('userId') || '';
  isLoading$: Observable<boolean> = inject(Store).select(TransactionHistoryState.isLoading);
  transacciones$: Observable<TransaccionModel[]>;
  transacciones: TransaccionModel[] = [];

  private destroy$ = new Subject<void>();

  constructor(public router: Router, private store: Store, private csv: CsvreportService, private pdf: PdfreportService, public dialogAccess: DialogAccessService, private _snackBar: MatSnackBar, public carritoService: CarritoService, public utils: UtilsService, public dialogsService: DialogAccessService) {
    this.transacciones$ = this.store.select(TransactionHistoryState.getTransactions);
  }
  ngOnDestroy(): void {
    this.destroy$.next(); // Emite un valor para desuscribirse
    this.destroy$.complete(); // Completa el Subject
  }

  async ngOnInit(): Promise<void> {
    this.store.dispatch([new GetTransaccion()]);
  }

  ngAfterViewInit() {
    this.store.dispatch([new GetTransaccion()]);
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
  checkboxLabel(row?: TransaccionModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    const transaccionId = row.transactionHistoryId ?? 0;
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${transaccionId + 1}`;
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
      'Servicio',
      'Producto',
      'Monto total',
      'Estado',
      'Usuario',
      'Creado en',
    ];

    const fields: (keyof TransaccionModel)[] = [
      'serviceId',
      'productId',
      'totalAmount',
      'status',
      'userId',
      'createdAt',
    ]
    const seleccionados = this.selection.selected;
    this.pdf.generatePDF(
      seleccionados,
      headers,
      'Reporte_Transacciones.pdf',
      fields,
      'Informe de Transacciones generadas: ' + new Date().toLocaleString(),
      'l' // Orientación vertical
    );
  }

  generarCSV() {
    const seleccionados = this.selection.selected;
    const headers = [
      'Servicio',
      'Producto',
      'Monto total',
      'Estado',
      'Usuario',
      'Creado en',
    ];

    const fields: (keyof TransaccionModel)[] = [
      'serviceId',
      'productId',
      'totalAmount',
      'status',
      'userId',
      'createdAt',
    ];
    this.csv.generateCSV(seleccionados, headers, 'Reporte_Transacciones.csv', fields);
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }
}
