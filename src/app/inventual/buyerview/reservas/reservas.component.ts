import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ReservacionModelString } from '../../models/producto.model';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservaState } from '../../state-management/reserva/reserva.state';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { ReservaByProviderState } from '../../state-management/reserva/reservaByProvider.state';
import { DialogAccessService } from '../../services/dialog-access.service';
import { CsvreportService } from '../../services/reportes/csvreport.service';
import { PdfreportService } from '../../services/reportes/pdfreport.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.scss']
})
export class ReservasComponent implements AfterViewInit {
  isLoading$: Observable<boolean> = inject(Store).select(ReservaByProviderState.isLoading);
  displayedColumns: string[] = [
    'select',
    'userId',
    'serviceId',
    'availabilityId',
    'petId',
    'date',
    'status',
    'action',
  ];
  dataSource: MatTableDataSource<ReservacionModelString> = new MatTableDataSource();
  selection = new SelectionModel<ReservacionModelString>(true, []);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private store: Store, private _snackBar: MatSnackBar, private csv: CsvreportService, private pdf: PdfreportService, public dialogsService: DialogAccessService) {
    // Assign your data array to the data source
    //this.dataSource = new MatTableDataSource(customerData);
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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${(row.reservationId || 0) + 1
      }`;
  }

  //sidebar menu activation start
  menuSidebarActive: boolean = false;
  myfunction() {
    if (this.menuSidebarActive == false) {
      this.menuSidebarActive = true;
    } else {
      this.menuSidebarActive = false;
    }
  }
  //sidebar menu activation end

  ngOnInit(): void { }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

}
