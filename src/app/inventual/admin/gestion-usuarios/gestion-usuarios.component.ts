import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UsuarioModel } from '../../models/usuario.model';
import { AddUsuario, DeleteUsuario, GetUsuario, UpdateUsuario } from '../../state-management/usuario/usuario.action';
import { UsuarioState } from '../../state-management/usuario/usuario.state';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.scss']
})
export class GestionUsuariosComponent implements AfterViewInit, OnInit {
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

  eliminarUsuario(id: number) {
    this.store.dispatch(new DeleteUsuario(id)).subscribe({
      next: () => {
        console.log('Usuario eliminado exitosamente');
        this.openSnackBar('Usuario eliminado correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al eliminar usuario:', error);
        this.openSnackBar('El usuario no se pudo eliminar', 'Cerrar');
      }
    });
  }

  actualizarUsuario(usuario: UsuarioModel) {
  //  this.store.dispatch(new UpdateUsuario(usuario));
  }

  usuarios$: Observable<UsuarioModel[]>;

  // Sidebar menu activation
  menuSidebarActive: boolean = false;
  toggleSidebar() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  // Table configuration
  displayedColumns: string[] = ['select', 'imageUrl','name', 'email', 'phoneNumber', 'location', 'preferredLanguage', 'lastLogin', 'createdAt','status', 'rolId', 'accion', 'providerId'];
  dataSource: MatTableDataSource<UsuarioModel> = new MatTableDataSource();
  selection = new SelectionModel<UsuarioModel>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store, private _snackBar: MatSnackBar) {
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

  checkboxLabel(row?: UsuarioModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.userId}`;
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
    // Despacha la acción para obtener los usuarios
    this.store.dispatch(new GetUsuario());

    // Suscríbete al observable para actualizar el dataSource
    this.usuarios$.subscribe((usuarios) => {
      this.dataSource.data = usuarios;
    });
  }
}