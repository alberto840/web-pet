import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { EspecialidadModel } from '../../models/especialidad.model';
import { AddEspecialidad, DeleteEspecialidad, GetEspecialidad, UpdateEspecialidad } from '../../state-management/especialidad/especialidad.action';
import { SpecialityState } from '../../state-management/especialidad/especialidad.state';

@Component({
  selector: 'app-gestion-especialidades',
  templateUrl: './gestion-especialidades.component.html',
  styleUrls: ['./gestion-especialidades.component.scss']
})
export class GestionEspecialidadesComponent implements AfterViewInit, OnInit {
  especialidad: EspecialidadModel = {
    specialtyId: 0,
    nameSpecialty: ''
  };

  agregarEspecialidad() {
    if (this.especialidad.nameSpecialty === '') {
      this.openSnackBar('Debe llenar todos los campos', 'Cerrar');
      return;
    }
    this.store.dispatch(new AddEspecialidad(this.especialidad)).subscribe({
      next: () => {
        console.log('Especialidad agregada exitosamente');
        this.openSnackBar('Especialidad agregada correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al agregar especialidad:', error);
        this.openSnackBar('La especialidad no se pudo agregar', 'Cerrar');
      }
    });
    this.especialidad = {
      specialtyId: 0,
      nameSpecialty: ''
    };
  }

  eliminarEspecialidad(id: number) {
    this.store.dispatch(new DeleteEspecialidad(id)).subscribe({
      next: () => {
        console.log('Especialidad eliminada exitosamente');
        this.openSnackBar('Especialidad eliminada correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al eliminar especialidad:', error);
        this.openSnackBar('La especialidad no se pudo eliminar', 'Cerrar');
      }
    });
  }

  actualizarEspecialidad(especialidad: EspecialidadModel) {
    this.store.dispatch(new UpdateEspecialidad(especialidad));
  }

  especialidades$: Observable<EspecialidadModel[]>;

  // Sidebar menu activation
  menuSidebarActive: boolean = false;
  toggleSidebar() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  // Table configuration
  displayedColumns: string[] = ['select', 'nameSpecialty', 'createdAt', 'accion'];
  dataSource: MatTableDataSource<EspecialidadModel> = new MatTableDataSource();
  selection = new SelectionModel<EspecialidadModel>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store, private _snackBar: MatSnackBar) {
    this.especialidades$ = this.store.select(SpecialityState.getSpecialities);
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

  checkboxLabel(row?: EspecialidadModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.specialtyId}`;
  }

  myfunction() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  generarPDF() {
    const seleccionados = this.selection.selected;
  }

  generarCSV() {    
    const seleccionados = this.selection.selected;
  }

  ngOnInit(): void {
    // Despacha la acción para obtener las especialidades
    this.store.dispatch(new GetEspecialidad());

    // Suscríbete al observable para actualizar el dataSource
    this.especialidades$.subscribe((especialidades) => {
      this.dataSource.data = especialidades;
    });
  }
}