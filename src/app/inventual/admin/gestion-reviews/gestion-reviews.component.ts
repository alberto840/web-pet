import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';
import { map, Observable } from 'rxjs';
import { ProveedorModel, ResenaModel, ResenaModelString } from '../../models/proveedor.model';
import { AddResena, DeleteResena, GetResena, UpdateResena } from '../../state-management/resena/resena.action';
import { ResenaState } from '../../state-management/resena/resena.state';
import { UsuarioModel } from '../../models/usuario.model';
import { UsuarioState } from '../../state-management/usuario/usuario.state';
import { ProveedorState } from '../../state-management/proveedor/proveedor.state';
import { GetProveedor } from '../../state-management/proveedor/proveedor.action';
import { GetUsuario } from '../../state-management/usuario/usuario.action';
import { CsvreportService } from '../../services/reportes/csvreport.service';
import { PdfreportService } from '../../services/reportes/pdfreport.service';
import { DialogAccessService } from '../../services/dialog-access.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-gestion-reviews',
  templateUrl: './gestion-reviews.component.html',
  styleUrls: ['./gestion-reviews.component.scss']
})
export class GestionReviewsComponent implements AfterViewInit, OnInit {
  isLoading$: Observable<boolean> = inject(Store).select(ResenaState.isLoading);
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
  displayedColumns: string[] = ['select', 'rating', 'comment', 'createdAt', 'userId', 'providerId', 'accion'];
  dataSource: MatTableDataSource<ResenaModelString> = new MatTableDataSource();
  selection = new SelectionModel<ResenaModelString>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store, private _snackBar: MatSnackBar, private csv: CsvreportService, private pdf: PdfreportService, public dialogsService: DialogAccessService) {
    this.reviews$ = this.store.select(ResenaState.getResenas);
    this.usuarios$ = this.store.select(UsuarioState.getUsuarios);
    this.providers$ = this.store.select(ProveedorState.getProveedores);
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

  checkboxLabel(row?: ResenaModelString): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.reviewsId}`;
  }

  generarPDF() {
    const headers = [
      'Review Id',
      'Rating',
      'Comentario',
      'User Id',
      'Provider Id',
      'Creado',
      'Usuario',
      'Proveedor',
    ];
    
    const fields: (keyof ResenaModelString)[] = [
      'reviewsId',
      'rating',
      'comment',
      'userId',
      'providerId',
      'createdAt',
      'userIdstring',
      'providerIdstring',
    ];
    const seleccionados = this.selection.selected;
    this.pdf.generatePDF(
      seleccionados,
      headers,
      'Reporte_Reviews.pdf',
      fields,
      'Informe de Reviews generado: ' + new Date().toLocaleString(),
      'l' // Orientación vertical
    );
  }

  generarCSV() {
    const headers = [
      'Review Id',
      'Rating',
      'Comentario',
      'User Id',
      'Provider Id',
      'Creado',
      'Usuario',
      'Proveedor',
    ];
    
    const fields: (keyof ResenaModelString)[] = [
      'reviewsId',
      'rating',
      'comment',
      'userId',
      'providerId',
      'createdAt',
      'userIdstring',
      'providerIdstring',
    ];
    const seleccionados = this.selection.selected;
    this.csv.generateCSV(seleccionados, headers, 'Reporte_Reviews.csv', fields);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async ngOnInit(): Promise<void> {
    // Despacha la acción para obtener los reviews
    this.store.dispatch([new GetResena(), new GetProveedor(), new GetUsuario()]);

    (await this.transformarDatosResenaString()).subscribe((reviews) => {
      this.dataSource.data = reviews; // Asigna los datos al dataSource
    });
    this.usuarios$.subscribe((usuarios) => {
      this.usuarios = usuarios;
    });
    this.providers$.subscribe((providers) => {
      this.providers = providers;
    });
  }

  providers$: Observable<ProveedorModel[]>;
  providers: ProveedorModel[] = [];

  getProviderName(id: number): string {
    if (!this.providers.length) {
      this.store.dispatch([new GetResena(), new GetProveedor(), new GetUsuario()]);
      return 'Cargando...'; // Si los roles aún no se han cargado
    }
    const provider = this.providers.find((r) => r.providerId === id);
    return provider ? provider.name : 'Sin provider';  // Devuelve el nombre del rol o "Sin Rol" si no se encuentra
  }
  usuarios$: Observable<UsuarioModel[]>;
  usuarios: UsuarioModel[] = [];
  getUserName(id: number): string {
    if (!this.usuarios.length) {
      this.store.dispatch([new GetResena(), new GetProveedor(), new GetUsuario()]);
      return 'Cargando...'; // Si los roles aún no se han cargado
    }
    const usuario = this.usuarios.find((r) => r.userId === id);
    return usuario ? usuario.name : 'Sin usuario';  // Devuelve el nombre del rol o "Sin Rol" si no se encuentra
  }

  async transformarDatosResenaString() {
    const listaActual$: Observable<ResenaModel[]> = this.reviews$;
    const listaModificada$: Observable<ResenaModelString[]> = listaActual$.pipe(
        map((objetos: ResenaModel[]) =>
            objetos.map((objeto: ResenaModel) => ({
                reviewsId: objeto.reviewsId,
                rating: objeto.rating,
                comment: objeto.comment,
                userId: objeto.userId,
                providerId: objeto.providerId,
                createdAt: objeto.createdAt,
                createdAtstring: objeto.createdAt ? format(new Date(objeto.createdAt), 'dd/MM/yyyy HH:mm:ss') : 'Fecha no disponible', // Formatea la fecha
                userIdstring: this.getUserName(objeto.userId), // Método para obtener el nombre del usuario
                providerIdstring: this.getProviderName(objeto.providerId), // Método para obtener el nombre del proveedor
            }))
        )
    );
    return listaModificada$;
}
}
