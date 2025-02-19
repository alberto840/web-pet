import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ProveedorModel } from '../../models/proveedor.model';
import { AddProveedor, DeleteProveedor, GetProveedor, UpdateProveedor } from '../../state-management/proveedor/proveedor.action';
import { ProveedorState } from '../../state-management/proveedor/proveedor.state';

@Component({
  selector: 'app-gestion-providers',
  templateUrl: './gestion-providers.component.html',
  styleUrls: ['./gestion-providers.component.scss']
})
export class GestionProvidersComponent implements AfterViewInit, OnInit {
  proveedor: ProveedorModel = {
    providerId: 0,
    name: '',
    description: '',
    address: '',
    userId: 0,
    rating: 0,
    status: true,
    imageUrl: '',
    reviews: 0
  };

  agregarProveedor() {
    if (
      this.proveedor.name === '' ||
      this.proveedor.description === '' ||
      this.proveedor.address === '' ||
      this.proveedor.userId <= 0
    ) {
      this.openSnackBar('Debe llenar todos los campos correctamente', 'Cerrar');
      return;
    }
    //this.store.dispatch(new AddProveedor(this.proveedor)).subscribe({
    //  next: () => {
    //    console.log('Proveedor agregado exitosamente');
    //    this.openSnackBar('Proveedor agregado correctamente', 'Cerrar');
    //  },
    //  error: (error) => {
    //   console.error('Error al agregar proveedor:', error);
    //    this.openSnackBar('El proveedor no se pudo agregar', 'Cerrar');
    //  }
    //});
    this.proveedor = {
      providerId: 0,
      name: '',
      description: '',
      address: '',
      userId: 0,
      rating: 0,
      status: true,
      imageUrl: '',
      reviews: 0
    };
  }

  eliminarProveedor(id: number) {
    this.store.dispatch(new DeleteProveedor(id)).subscribe({
      next: () => {
        console.log('Proveedor eliminado exitosamente');
        this.openSnackBar('Proveedor eliminado correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al eliminar proveedor:', error);
        this.openSnackBar('El proveedor no se pudo eliminar', 'Cerrar');
      }
    });
  }

  actualizarProveedor(proveedor: ProveedorModel) {
  //  this.store.dispatch(new UpdateProveedor(proveedor));
  }

  proveedores$: Observable<ProveedorModel[]>;

  // Sidebar menu activation
  menuSidebarActive: boolean = false;
  toggleSidebar() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  // Table configuration
  displayedColumns: string[] = ['select', 'imageUrl', 'name', 'description', 'address', 'userId', 'rating', 'createdAt', 'updatedAt','status', 'reviews', 'productCount', 'serviceCount','accion'];
  dataSource: MatTableDataSource<ProveedorModel> = new MatTableDataSource();
  selection = new SelectionModel<ProveedorModel>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store, private _snackBar: MatSnackBar) {
    this.proveedores$ = this.store.select(ProveedorState.getProveedores);
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

  checkboxLabel(row?: ProveedorModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.providerId}`;
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
    // Despacha la acción para obtener los proveedores
    this.store.dispatch(new GetProveedor());

    // Suscríbete al observable para actualizar el dataSource
    this.proveedores$.subscribe((proveedores) => {
      this.dataSource.data = proveedores;
    });
  }
}
