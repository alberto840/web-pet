import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';
import { map, Observable } from 'rxjs';
import { ProveedorModel, ProveedorModelString } from '../../models/proveedor.model';
import { AddProveedor, DeleteProveedor, GetProveedor, UpdateProveedor } from '../../state-management/proveedor/proveedor.action';
import { ProveedorState } from '../../state-management/proveedor/proveedor.state';
import { UsuarioState } from '../../state-management/usuario/usuario.state';
import { UsuarioModel } from '../../models/usuario.model';
import { GetUsuario } from '../../state-management/usuario/usuario.action';
import { CsvreportService } from '../../services/reportes/csvreport.service';
import { PdfreportService } from '../../services/reportes/pdfreport.service';
import { DialogAccessService } from '../../services/dialog-access.service';
import { format } from 'date-fns';
import { UtilsService } from '../../utils/utils.service';

@Component({
  selector: 'app-gestion-providers',
  templateUrl: './gestion-providers.component.html',
  styleUrls: ['./gestion-providers.component.scss']
})
export class GestionProvidersComponent implements AfterViewInit, OnInit {
  isLoading$: Observable<boolean> = inject(Store).select(ProveedorState.isLoading);
  usuarios: UsuarioModel[] = [];
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

  actualizarProveedor(proveedor: ProveedorModel) {
    //  this.store.dispatch(new UpdateProveedor(proveedor));
  }

  proveedores$: Observable<ProveedorModel[]>;
  usuarios$: Observable<UsuarioModel[]>;
  // Sidebar menu activation
  menuSidebarActive: boolean = false;
  toggleSidebar() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  // Table configuration
  displayedColumns: string[] = ['select', 'imageUrl', 'name', 'description', 'address', 'userId', 'rating', 'createdAt', 'updatedAt', 'status', 'reviews', 'productCount', 'serviceCount', 'accion'];
  dataSource: MatTableDataSource<ProveedorModelString> = new MatTableDataSource();
  selection = new SelectionModel<ProveedorModelString>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store, private _snackBar: MatSnackBar, private csv: CsvreportService, private pdf: PdfreportService, public dialogsService: DialogAccessService, public utils: UtilsService) {
    this.proveedores$ = this.store.select(ProveedorState.getProveedores);
    this.usuarios$ = this.store.select(UsuarioState.getUsuarios);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  ngAfterViewInit() {
    this.store.dispatch([new GetProveedor(), new GetUsuario()]);
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

  checkboxLabel(row?: ProveedorModelString): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.providerId}`;
  }

  generarPDF() {
    const headers = [
      'Provider Id',
      'Nombre',
      'Descripción',
      'Dirección',
      'User Id',
      'Usuario',
      'Rating',
      'Estado',
      'Creado',
      'Actualizado',
      'Cantidad de Productos',
      'Cantidad de Servicios',
      'Reseñas',
    ];

    const fields: (keyof ProveedorModelString)[] = [
      'providerId',
      'name',
      'description',
      'address',
      'userId',
      'userIdstring',
      'rating',
      'status',
      'createdAt',
      'updatedAt',
      'productCount',
      'serviceCount',
      'reviews',
    ];
    const seleccionados = this.selection.selected;
    this.pdf.generatePDF(
      seleccionados,
      headers,
      'Reporte_Proveedores.pdf',
      fields,
      'Informe de Proveedores generado: ' + new Date().toLocaleString(),
      'l', // Orientación vertical
      [400, 210]
    );
  }

  generarCSV() {
    const headers = [
      'Provider Id',
      'Nombre',
      'Descripción',
      'Dirección',
      'User Id',
      'Usuario',
      'Rating',
      'Estado',
      'Creado',
      'Actualizado',
      'Cantidad de Productos',
      'Cantidad de Servicios',
      'Reseñas',
    ];

    const fields: (keyof ProveedorModelString)[] = [
      'providerId',
      'name',
      'description',
      'address',
      'userId',
      'userIdstring',
      'rating',
      'status',
      'createdAt',
      'updatedAt',
      'productCount',
      'serviceCount',
      'reviews',
    ];
    const seleccionados = this.selection.selected;
    this.csv.generateCSV(seleccionados, headers, 'Reporte_Proovedores.csv', fields);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async ngOnInit(): Promise<void> {
    // Despacha la acción para obtener los proveedores
    this.store.dispatch([new GetProveedor(), new GetUsuario()]);
    (await this.transformarDatosProveedorString()).subscribe((proveedor) => {
      this.dataSource.data = proveedor; // Asigna los datos al dataSource
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.usuarios$.subscribe((usuarios) => {
      this.usuarios = usuarios;
    });
  }

  getUserName(id: number): string {
    if (!this.usuarios.length) {
      return 'Cargando...'; // Si los roles aún no se han cargado
    }
    const usuario = this.usuarios.find((r) => r.userId === id);
    return usuario ? usuario.name : 'Sin usuario';  // Devuelve el nombre del rol o "Sin Rol" si no se encuentra
  }

  async transformarDatosProveedorString() {
    const listaActual$: Observable<ProveedorModel[]> = this.proveedores$;
    const listaModificada$: Observable<ProveedorModelString[]> = listaActual$.pipe(
      map((objetos: ProveedorModel[]) =>
        objetos.map((objeto: ProveedorModel) => ({
          providerId: objeto.providerId,
          name: objeto.name,
          description: objeto.description,
          address: objeto.address,
          userId: objeto.userId,
          userIdstring: this.getUserName(objeto.userId), // Método para obtener el nombre del usuario
          rating: objeto.rating,
          status: objeto.status,
          createdAt: objeto.createdAt,
          updatedAt: objeto.updatedAt,
          createdAtstring: objeto.createdAt ? format(new Date(objeto.createdAt), 'dd/MM/yyyy HH:mm:ss') : '',
          updatedAtstring: objeto.updatedAt ? format(new Date(objeto.updatedAt), 'dd/MM/yyyy HH:mm:ss') : '',
          productCount: objeto.productCount,
          serviceCount: objeto.serviceCount,
          imageUrl: objeto.imageUrl,
          reviews: objeto.reviews,
        }))
      )
    );
    return listaModificada$;
  }
}
