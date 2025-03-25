import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';
import { last, map, Observable } from 'rxjs';
import { UsuarioModel, UsuarioStringModel } from '../../models/usuario.model';
import { AddUsuario, DeleteUsuario, GetUsuario, UpdateUsuario } from '../../state-management/usuario/usuario.action';
import { UsuarioState } from '../../state-management/usuario/usuario.state';
import { RolModel } from '../../models/rol.model';
import { RolState } from '../../state-management/rol/rol.state';
import { GetRol } from '../../state-management/rol/rol.action';
import { CsvreportService } from '../../services/reportes/csvreport.service';
import { PdfreportService } from '../../services/reportes/pdfreport.service';
import { DialogAccessService } from '../../services/dialog-access.service';
import { format } from 'date-fns';
import { UtilsService } from '../../utils/utils.service';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.scss']
})
export class GestionUsuariosComponent implements AfterViewInit, OnInit {
  isLoading$: Observable<boolean> = inject(Store).select(UsuarioState.isLoading);
  isLoadingrol$: Observable<boolean> = inject(Store).select(RolState.isLoading);
  usuario: UsuarioModel = {
    userId: 0,
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    location: '',
    preferredLanguage: '',
    status: true,
    rolId: 0,
    imageUrl: ''
  };

  agregarUsuario() {
    if (
      this.usuario.name === '' ||
      this.usuario.email === '' ||
      this.usuario.phoneNumber === '' ||
      this.usuario.location === '' ||
      this.usuario.preferredLanguage === '' ||
      this.usuario.rolId <= 0
    ) {
      this.openSnackBar('Debe llenar todos los campos correctamente', 'Cerrar');
      return;
    }
    //this.store.dispatch(new AddUsuario(this.usuario)).subscribe({
    //  next: () => {
    //    console.log('Usuario agregado exitosamente');
    //    this.openSnackBar('Usuario agregado correctamente', 'Cerrar');
    //  },
    //  error: (error) => {
    //    console.error('Error al agregar usuario:', error);
    //    this.openSnackBar('El usuario no se pudo agregar', 'Cerrar');
    //  }
    //});
    this.usuario = {
      userId: 0,
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      location: '',
      preferredLanguage: '',
      status: true,
      rolId: 0,
      imageUrl: ''
    };
  }

  actualizarUsuario(usuario: UsuarioModel) {
    //  this.store.dispatch(new UpdateUsuario(usuario));
  }

  usuarios$: Observable<UsuarioModel[]>;
  roles$: Observable<RolModel[]>

  // Sidebar menu activation
  menuSidebarActive: boolean = false;
  toggleSidebar() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  // Table configuration
  displayedColumns: string[] = ['select', 'imageUrl', 'name', 'email', 'phoneNumber', 'location', 'preferredLanguage', 'lastLogin', 'createdAt', 'status', 'rolId', 'accion'];
  dataSource: MatTableDataSource<UsuarioStringModel> = new MatTableDataSource();
  selection = new SelectionModel<UsuarioStringModel>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store, private _snackBar: MatSnackBar, private csv: CsvreportService, private pdf: PdfreportService, public dialogsService: DialogAccessService, public utils: UtilsService) {
    this.usuarios$ = this.store.select(UsuarioState.getUsuarios);
    this.roles$ = this.store.select(RolState.getRoles)
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

  checkboxLabel(row?: UsuarioStringModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.userId}`;
  }

  generarPDF() {
    const seleccionados = this.selection.selected;
    const columns = [
      'User Id',
      'Nombre',
      'Email',
      'Teléfono',
      'Ubicación',
      'Idioma Preferido',
      'Estado',
      'Creado',
      'Rol',];
    const fields: (keyof UsuarioStringModel)[] = [
      'userId',
      'name',
      'email',
      'phoneNumber',
      'location',
      'preferredLanguage',
      'status',
      'createdAt',
      'rolIdString',];
    this.pdf.generatePDF(
      seleccionados,
      columns,
      'informe-usuarios.pdf',
      fields,
      'Informe de Usuarios generado: ' + new Date().toLocaleString(),
      'l' // Orientación vertical
    );
  }

  generarCSV() {
    const seleccionados = this.selection.selected;    
    const headers = [
      'User Id',
      'Nombre',
      'Email',
      'Teléfono',
      'Ubicación',
      'Idioma Preferido',
      'Estado',
      'Creado',
      'Rol',
    ];    
    const fields: (keyof UsuarioStringModel)[] = [
      'userId',
      'name',
      'email',
      'phoneNumber',
      'location',
      'preferredLanguage',
      'status',
      'createdAt',
      'rolIdString',
    ];
    
    this.csv.generateCSV(seleccionados, headers, 'Reporte_Usuarios.csv', fields);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async ngOnInit(): Promise<void> {
    // Despacha la acción para obtener los usuarios
    this.store.dispatch([new GetUsuario(), new GetRol()]);

    (await this.transformarDatosUsuarioString()).subscribe((usuario) => {
      this.dataSource.data = usuario; // Asigna los datos al dataSource
    });
    this.roles$.subscribe((roles) => {
      this.roles = roles;
    });
  }
  roles: RolModel[] = [];
  getRolName(id: number): string {
    if (!this.roles.length) {
      this.store.dispatch([new GetUsuario(), new GetRol()]);
      return 'Cargando...'; // Si los roles aún no se han cargado
    }
    const rol = this.roles.find((r) => r.rolId === id);
    return rol ? rol.name : 'Sin rol';  // Devuelve el nombre del rol o "Sin Rol" si no se encuentra
  }

  async transformarDatosUsuarioString() {
    const listaActual$: Observable<UsuarioModel[]> = this.usuarios$;
    const listaModificada$: Observable<UsuarioStringModel[]> = listaActual$.pipe(
      map((objetos: UsuarioModel[]) =>
        objetos.map((objeto: UsuarioModel) => ({
          userId: objeto.userId,
          name: objeto.name,
          email: objeto.email,
          phoneNumber: objeto.phoneNumber,
          location: objeto.location,
          preferredLanguage: objeto.preferredLanguage,
          status: objeto.status,
          createdAt: objeto.createdAt,
          lastLogin: objeto.lastLogin,
          createdAtstring: objeto.createdAt ? format(new Date(objeto.createdAt), 'dd/MM/yyyy') : '',
          lastLoginstring: objeto.lastLogin ? format(new Date(objeto.lastLogin), 'dd/MM/yyyy') : '',
          rolId: objeto.rolId,
          rolIdString: this.getRolName(objeto.rolId),
          imageUrl: objeto.imageUrl
        }))
      )
    );
    return listaModificada$;
  }
}