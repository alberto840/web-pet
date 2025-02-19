import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { CategoriaModel } from '../../models/categoria.model';
import { AddCategoria, DeleteCategoria, getCategorias, UpdateCategoria } from '../../state-management/categoria/categoria.action';
import { CategoriaState } from '../../state-management/categoria/categoria.state';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DialogAccessService } from '../../services/dialog-access.service';
import { PdfreportService } from '../../services/reportes/pdfreport.service';
import { CsvreportService } from '../../services/reportes/csvreport.service';

@Component({
  selector: 'app-gestion-categorias',
  templateUrl: './gestion-categorias.component.html',
  styleUrls: ['./gestion-categorias.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GestionCategoriasComponent implements AfterViewInit {
  categoria: CategoriaModel = {
    nameCategory: '',
    icono: ''
  }
  
  agregarCategoria() {
    if(this.categoria.nameCategory == '' || this.categoria.icono == '') {
      this.openSnackBar('Debe llenar todos los campos', 'Cerrar');
      return;
    }
    this.store.dispatch(new AddCategoria(this.categoria)).subscribe({
      next: () => {
        console.log('categoria agregada exitosamente');
        this.openSnackBar('categoria agregada correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al agregada categoria:', error);
        this.openSnackBar('La categoria no se pudo agregada', 'Cerrar');
      }
    });
    this.categoria = {
      nameCategory: '',
      icono: ''
    }
  }
  
  eliminarCategoria(id: number) {
    this.store.dispatch(new DeleteCategoria(id)).subscribe({
      next: () => {
        console.log('categoria eliminada exitosamente');
        this.openSnackBar('categoria eliminada correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al eliminada categoria:', error);
        this.openSnackBar('La categoria no se pudo eliminar', 'Cerrar');
      }
    });
  }
  
  actualizarcategoria(categoria: CategoriaModel) {    
    this.store.dispatch(new UpdateCategoria(this.categoria));
  }
  
  categorias$: Observable<CategoriaModel[]>;
  //sidebar menu activation start
  menuSidebarActive: boolean = false;
  myfunction() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }
  //sidebar menu activation end
  
  displayedColumns: string[] = ['select', 'nameCategory', 'icono', 'createdAt','accion'];
  dataSource: MatTableDataSource<CategoriaModel> = new MatTableDataSource(); 
  selection = new SelectionModel<CategoriaModel>(true, []);
  
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  
  constructor(private store: Store, public pdfreportService: PdfreportService, private _snackBar: MatSnackBar, public csvreportService: CsvreportService, public dialogsService: DialogAccessService) {
    this.categorias$ = this.store.select(CategoriaState.getCategorias);
  }
  
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {duration: 2000});
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
  
  ngOnInit(): void {
    // Despacha la acción para obtener las empresas
    this.store.dispatch([new getCategorias()]);
  
    // Suscríbete al observable para actualizar el dataSource
    this.categorias$.subscribe((categoria) => {
      this.dataSource.data = categoria; // Asigna los datos al dataSource
    });
  }
  
}
