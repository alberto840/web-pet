import { AfterViewInit, Component, inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { ServicioState } from '../../state-management/servicio/servicio.state';
import { ServicioModel } from '../../models/producto.model';
import { GetServicio } from '../../state-management/servicio/servicio.action';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { DialogAccessService } from '../../services/dialog-access.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-my-services',
  templateUrl: './my-services.component.html',
  styleUrls: ['./my-services.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MyServicesComponent implements AfterViewInit {
  displayedColumns: string[] = ['select', 'imagen', 'nombre', 'precio', 'duracion', 'categoria', 'descripcion', 'estado', 'fechaCreacion', 'action'];
  dataSource: MatTableDataSource<ServicioModel> = new MatTableDataSource(); // Cambiado el tipo a `any`
  selection = new SelectionModel<ServicioModel>(true, []);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  userId: string = localStorage.getItem('userId') || '';
  isLoading$: Observable<boolean> = inject(Store).select(ServicioState.isLoading);
  servicios$: Observable<ServicioModel[]>;
  serviciosLista: ServicioModel[] = [];

  constructor(public router: Router, private store: Store, public dialogAccess: DialogAccessService, private _snackBar: MatSnackBar) {
    this.servicios$ = this.store.select(ServicioState.getServicios);
  }

  ngOnInit(): void {
    this.store.dispatch([new GetServicio()]);
    this.servicios$.subscribe((servicios) => {
      this.serviciosLista = servicios;
    });

    // Suscríbete al observable para actualizar el dataSource
    this.servicios$.subscribe((servicios) => {
      this.dataSource.data = servicios; // Asigna los datos al dataSource
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
  checkboxLabel(row?: ServicioModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    const serviceId = row.serviceId ?? 0; // Provide a default value of 0 if serviceId is undefined
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${serviceId + 1}`;
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
    this._snackBar.open(message, action, {duration: 2000});
  }

}
