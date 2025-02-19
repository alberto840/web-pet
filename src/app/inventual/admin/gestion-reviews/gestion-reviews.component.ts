import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ResenaModel } from '../../models/proveedor.model';
import { AddResena, DeleteResena, GetResena, UpdateResena } from '../../state-management/resena/resena.action';
import { ResenaState } from '../../state-management/resena/resena.state';

@Component({
  selector: 'app-gestion-reviews',
  templateUrl: './gestion-reviews.component.html',
  styleUrls: ['./gestion-reviews.component.scss']
})
export class GestionReviewsComponent implements AfterViewInit, OnInit {
  review: ResenaModel = {
    rating: 0,
    comment: '',
    userId: 0,
    providerId: 0
  };

  agregarReview() {
    if (this.review.rating == 0 || this.review.comment == '' || this.review.userId == 0 || this.review.providerId == 0) {
      this.openSnackBar('Debe llenar todos los campos', 'Cerrar');
      return;
    }
    this.store.dispatch(new AddResena(this.review)).subscribe({
      next: () => {
        console.log('Review agregado exitosamente');
        this.openSnackBar('Review agregado correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al agregar review:', error);
        this.openSnackBar('El review no se pudo agregar', 'Cerrar');
      }
    });
    this.review = {
      rating: 0,
      comment: '',
      userId: 0,
      providerId: 0
    };
  }

  eliminarReview(id: number) {
    this.store.dispatch(new DeleteResena(id)).subscribe({
      next: () => {
        console.log('Review eliminado exitosamente');
        this.openSnackBar('Review eliminado correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al eliminar review:', error);
        this.openSnackBar('El review no se pudo eliminar', 'Cerrar');
      }
    });
  }

  actualizarReview(review: ResenaModel) {
    this.store.dispatch(new UpdateResena(review));
  }

  reviews$: Observable<ResenaModel[]>;

  // Sidebar menu activation
  menuSidebarActive: boolean = false;
  toggleSidebar() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }

  // Table configuration
  displayedColumns: string[] = ['select', 'rating', 'comment', 'createdAt', 'userId', 'providerId','accion'];
  dataSource: MatTableDataSource<ResenaModel> = new MatTableDataSource();
  selection = new SelectionModel<ResenaModel>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store, private _snackBar: MatSnackBar) {
    this.reviews$ = this.store.select(ResenaState.getResenas);
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

  checkboxLabel(row?: ResenaModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.reviewsId}`;
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
    // Despacha la acción para obtener los reviews
    this.store.dispatch(new GetResena());

    // Suscríbete al observable para actualizar el dataSource
    this.reviews$.subscribe((reviews) => {
      this.dataSource.data = reviews;
    });
  }
}
