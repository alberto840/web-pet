import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ServicioModel } from '../../models/producto.model';
import { AddServicio, DeleteServicio, GetServicio, UpdateServicio } from '../../state-management/servicio/servicio.action';
import { ServicioState } from '../../state-management/servicio/servicio.state';

@Component({
  selector: 'app-gestion-servicios',
  templateUrl: './gestion-servicios.component.html',
  styleUrls: ['./gestion-servicios.component.scss']
})
export class GestionServiciosComponent implements AfterViewInit, OnInit {
  servicio: ServicioModel = {
    serviceId: 0,
    serviceName: '',
    price: 0,
    duration: 0,
    description: '',
    status: true,
    providerId: 0,
    imageId: null,
    imageUrl: '',
    cantidad: 0,
    tipoAtencion: ''
  };

  agregarServicio() {
    if (
      this.servicio.serviceName === '' ||
      this.servicio.description === '' ||
      this.servicio.price <= 0 ||
      this.servicio.duration <= 0 ||
      this.servicio.providerId <= 0 ||
      this.servicio.tipoAtencion === ''
    ) {
      this.openSnackBar('Debe llenar todos los campos correctamente', 'Cerrar');
      return;
    }
    //this.store.dispatch(new AddServicio(this.servicio)).subscribe({
    //  next: () => {
    //    console.log('Servicio agregado exitosamente');
    //    this.openSnackBar('Servicio agregado correctamente', 'Cerrar');
    //  },
    //  error: (error) => {
    //    console.error('Error al agregar servicio:', error);
    //    this.openSnackBar('El servicio no se pudo agregar', 'Cerrar');
    //  }
    //});
    this.servicio = {
      serviceId: 0,
      serviceName: '',
      price: 0,
      duration: 0,
      description: '',
      status: true,
      providerId: 0,
      imageId: null,
      imageUrl: '',
      cantidad: 0,
      tipoAtencion: ''
    };
  }

  eliminarServicio(id: number) {
    this.store.dispatch(new DeleteServicio(id)).subscribe({
      next: () => {
        console.log('Servicio eliminado exitosamente');
        this.openSnackBar('Servicio eliminado correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al eliminar servicio:', error);
        this.openSnackBar('El servicio no se pudo eliminar', 'Cerrar');
      }
    });
  }

  actualizarServicio(servicio: ServicioModel) {
  //  this.store.dispatch(new UpdateServicio(servicio));
  }

  servicios$: Observable<ServicioModel[]>;

  // Sidebar menu activation
  menuSidebarActive: boolean = false;
  toggleSidebar() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  // Table configuration
  displayedColumns: string[] = ['select', 'imageUrl', 'serviceName', 'description', 'price', 'duration', 'status', 'providerId', 'tipoAtencion', 'createdAt','accion'];
  dataSource: MatTableDataSource<ServicioModel> = new MatTableDataSource();
  selection = new SelectionModel<ServicioModel>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store, private _snackBar: MatSnackBar) {
    this.servicios$ = this.store.select(ServicioState.getServicios);
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

  checkboxLabel(row?: ServicioModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.serviceId}`;
  }

  generarPDF() {
    const seleccionados = this.selection.selected;
  }

  generarCSV() {    
    const seleccionados = this.selection.selected;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    // Despacha la acción para obtener los servicios
    this.store.dispatch(new GetServicio());

    // Suscríbete al observable para actualizar el dataSource
    this.servicios$.subscribe((servicios) => {
      this.dataSource.data = servicios;
    });
  }
}