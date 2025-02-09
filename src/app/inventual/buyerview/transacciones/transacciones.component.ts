import { AfterViewInit, Component, inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { TransaccionModel } from '../../models/producto.model';
import { TransactionHistoryState } from '../../state-management/transaccion/transaccion.state';
import { GetTransaccion } from '../../state-management/transaccion/transaccion.action';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CarritoService } from '../../services/carrito.service';
import { DialogAccessService } from '../../services/dialog-access.service';

@Component({
  selector: 'app-transacciones',
  templateUrl: './transacciones.component.html',
  styleUrls: ['./transacciones.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TransaccionesComponent implements AfterViewInit {
  displayedColumns: string[] = ['select', 'imagen', 'nombre', 'precio', 'duracion', 'categoria', 'descripcion', 'estado', 'fechaCreacion', 'action'];
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

  constructor(public router: Router, private store: Store, public dialogAccess: DialogAccessService, private _snackBar: MatSnackBar, public carritoService: CarritoService) {
    this.transacciones$ = this.store.select(TransactionHistoryState.getTransactions);
  }

  ngOnInit(): void {
    this.store.dispatch([new GetTransaccion()]);
    this.transacciones$.subscribe((transacciones) => {
      this.transacciones = transacciones;
    });

    // Suscríbete al observable para actualizar el dataSource
    this.transacciones$.subscribe((transacciones) => {
      this.dataSource.data = transacciones; // Asigna los datos al dataSource
    });
  }

  ngAfterViewInit() {
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
    //const bonosSeleccionados = this.selection.selected;
    //this.pdfreportService.bonospdf(bonosSeleccionados);
  }

  generarCSV() {
    //const bonosSeleccionados = this.selection.selected;
    //this.csvreportService.bonoscsv(bonosSeleccionados);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }
}