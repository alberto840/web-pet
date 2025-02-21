import { AfterViewInit, Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CategoriaModel, CategoriaModelString, SubCategoriaModel, SubCategoriaModelString, SubSubCategoriaModel, SubSubCategoriaModelString } from '../../models/categoria.model';
import { AddCategoria, DeleteCategoria, getCategorias, UpdateCategoria } from '../../state-management/categoria/categoria.action';
import { CategoriaState } from '../../state-management/categoria/categoria.state';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';
import { map, Observable } from 'rxjs';
import { DialogAccessService } from '../../services/dialog-access.service';
import { PdfreportService } from '../../services/reportes/pdfreport.service';
import { CsvreportService } from '../../services/reportes/csvreport.service';
import { AddSubcategoria, GetSubcategoria } from '../../state-management/subcategoria/subcategoria.action';
import { AddSubsubcategoria, GetSubsubcategoria } from '../../state-management/subsubcategoria/subsubcategoria.action';
import { SubcategoriaState } from '../../state-management/subcategoria/subcategoria.state';
import { SubsubcategoriaState } from '../../state-management/subsubcategoria/subsubcategoria.state';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-gestion-categorias',
  templateUrl: './gestion-categorias.component.html',
  styleUrls: ['./gestion-categorias.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GestionCategoriasComponent implements AfterViewInit, OnInit {
  isLoading$: Observable<boolean> = inject(Store).select(CategoriaState.isLoading);
  isLoadingsub$: Observable<boolean> = inject(Store).select(SubcategoriaState.isLoading);
  isLoadingsubsub$: Observable<boolean> = inject(Store).select(SubsubcategoriaState.isLoading);
  categoria: CategoriaModel = {
    nameCategory: '',
    icono: ''
  }
  categorias: CategoriaModel[] = [];
  subcategoria: SubCategoriaModel = {
    nameSubCategoria: '',
    categoryId: 0
  }
  subcategorias: SubCategoriaModel[] = [];
  subsubcategoria: SubSubCategoriaModel = {
    nameSubSubCategoria: '',
    subCategoriaId: 0
  }
  subsubcategorias: SubSubCategoriaModel[] = [];

  agregarCategoria() {
    if (this.categoria.nameCategory == '' || this.categoria.icono == '') {
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

  agregarSubCategoria() {
    if (this.subcategoria.nameSubCategoria == '' || this.subcategoria.categoryId == 0) {
      this.openSnackBar('Debe llenar todos los campos', 'Cerrar');
      return;
    }
    this.store.dispatch(new AddSubcategoria(this.subcategoria)).subscribe({
      next: () => {
        console.log('subcategoria agregada exitosamente');
        this.openSnackBar('subcategoria agregada correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al agregada subcategoria:', error);
        this.openSnackBar('La subcategoria no se pudo agregada', 'Cerrar');
      }
    });
    this.subcategoria = {
      nameSubCategoria: '',
      categoryId: 0
    }
  }

  agregarSubSubCategoria() {
    if (this.subsubcategoria.nameSubSubCategoria == '' || this.subsubcategoria.subCategoriaId == 0) {
      this.openSnackBar('Debe llenar todos los campos', 'Cerrar');
      return;
    }
    this.store.dispatch(new AddSubsubcategoria(this.subsubcategoria)).subscribe({
      next: () => {
        console.log('subsubcategoria agregada exitosamente');
        this.openSnackBar('subsubcategoria agregada correctamente', 'Cerrar');
      },
      error: (error) => {
        console.error('Error al agregada subsubcategoria:', error);
        this.openSnackBar('La subsubcategoria no se pudo agregada', 'Cerrar');
      }
    });
    this.subsubcategoria = {
      nameSubSubCategoria: '',
      subCategoriaId: 0
    }
  }

  categorias$: Observable<CategoriaModel[]>;
  subcategorias$: Observable<SubCategoriaModel[]>;
  subsubcategorias$: Observable<SubSubCategoriaModel[]>;

  //sidebar menu activation start
  menuSidebarActive: boolean = false;
  myfunction() {
    this.menuSidebarActive = !this.menuSidebarActive;
  }
  //sidebar menu activation end

  displayedColumns: string[] = ['nameCategory', 'icono', 'createdAt', 'accion'];
  displayedColumnssubsub: string[] = ['nameSubSubCategoria', 'subCategoriaId', 'accion'];
  displayedColumnssub: string[] = ['nameSubCategoria', 'categoryId', 'accion'];
  dataSource: MatTableDataSource<CategoriaModel> = new MatTableDataSource();
  selection = new SelectionModel<CategoriaModel>(true, []);
  dataSourcesub: MatTableDataSource<SubCategoriaModelString> = new MatTableDataSource();
  selectionsub = new SelectionModel<SubCategoriaModelString>(true, []);
  dataSourcesubsub: MatTableDataSource<SubSubCategoriaModelString> = new MatTableDataSource();
  selectionsubsub = new SelectionModel<SubSubCategoriaModelString>(true, []);


  @ViewChild('MatPaginator')
  paginator!: MatPaginator;
  @ViewChild('MatSort')
  sort!: MatSort;

  @ViewChild('MatPaginatorsub')
  paginatorsub!: MatPaginator;
  @ViewChild('MatSortsub')
  sortsub!: MatSort;

  @ViewChild('MatPaginatorsubsub')
  paginatorsubsub!: MatPaginator;
  @ViewChild('MatSortsubsub')
  sortsubsub!: MatSort;

  constructor(private _liveAnnouncer: LiveAnnouncer, private store: Store, public pdfreportService: PdfreportService, private _snackBar: MatSnackBar, public csvreportService: CsvreportService, public dialogsService: DialogAccessService) {
    this.categorias$ = this.store.select(CategoriaState.getCategorias);
    this.subcategorias$ = this.store.select(SubcategoriaState.getSubcategorias);
    this.subsubcategorias$ = this.store.select(SubsubcategoriaState.getSubsubcategorias);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSourcesub.paginator = this.paginatorsub;
    this.dataSourcesub.sort = this.sortsub;
    this.dataSourcesubsub.paginator = this.paginatorsubsub;
    this.dataSourcesubsub.sort = this.sortsubsub;
  }

  generarPDF() {
    const seleccionados = this.dataSource.data;
    const seleccionadossub = this.dataSourcesub.data;
    const seleccionadossubsub = this.dataSourcesubsub.data;
    this.csvreportService.ubicacionescsv(seleccionados, seleccionadossub, seleccionadossubsub);
  }

  generarCSV() {
    const seleccionados = this.dataSource.data;
    const seleccionadossub = this.dataSourcesub.data;
    const seleccionadossubsub = this.dataSourcesubsub.data;
    this.pdfreportService.categoriaspdf(seleccionados, seleccionadossub, seleccionadossubsub);
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  async ngOnInit(): Promise<void> {
    // Despacha la acción para obtener las empresas
    this.store.dispatch([new getCategorias(), new GetSubcategoria(), new GetSubsubcategoria()]);

    (await this.transformarDatosSubCategoriaString()).subscribe((subcategoria) => {
      this.dataSourcesub.data = subcategoria; // Asigna los datos al dataSource
    });
    (await this.transformarDatosSubSubCategoriaString()).subscribe((subsubcategoria) => {
      this.dataSourcesubsub.data = subsubcategoria; // Asigna los datos al dataSource
    });
    // Suscríbete al observable para actualizar el dataSource
    this.categorias$.subscribe((categoria) => {
      this.dataSource.data = categoria; // Asigna los datos al dataSource
      this.categorias = categoria;
    });
    // Suscríbete al observable para actualizar el dataSource
    this.subcategorias$.subscribe((subcategoria) => {
      this.subcategorias = subcategoria;
    });
    // Suscríbete al observable para actualizar el dataSource
    this.subsubcategorias$.subscribe((subsubcategoria) => {
      this.subsubcategorias = subsubcategoria;
    });
  }

  //CONVERTIR A STRING
  getCategoriaName(id: number): string {
    if (!this.categorias.length) {
      return 'Cargando...'; // Si los roles aún no se han cargado
    }
    const categoria = this.categorias.find((r) => r.categoryId === id);
    return categoria ? categoria.nameCategory : 'Sin Categoria';  // Devuelve el nombre del rol o "Sin Rol" si no se encuentra
  }
  getSubCategoriaName(id: number): string {
    if (!this.subcategorias.length) {
      return 'Cargando...'; // Si los roles aún no se han cargado
    }
    const subcategoria = this.subcategorias.find((r) => r.subCategoriaId === id);
    return subcategoria ? subcategoria.nameSubCategoria : 'Sin SubCategoria';  // Devuelve el nombre del rol o "Sin Rol" si no se encuentra
  }
  transformarDatosCategoriaString() {
    const listaActual$: Observable<CategoriaModel[]> = this.categorias$;
    const listaModificada$: Observable<CategoriaModelString[]> = listaActual$.pipe(
      map((objetos: CategoriaModel[]) =>
        objetos.map((objeto: CategoriaModel) => ({
          categoryId: objeto.categoryId,
          nameCategory: objeto.nameCategory,
          icono: objeto.icono,
        }))
      )
    );
    return listaModificada$;
  }
  async transformarDatosSubCategoriaString() {
    const listaActual$: Observable<SubCategoriaModel[]> = this.subcategorias$;
    const listaModificada$: Observable<SubCategoriaModelString[]> = listaActual$.pipe(
      map((objetos: SubCategoriaModel[]) =>
        objetos.map((objeto: SubCategoriaModel) => ({
          subCategoriaId: objeto.subCategoriaId,
          nameSubCategoria: objeto.nameSubCategoria,
          categoryId: objeto.categoryId,
          categoryIdString: this.getCategoriaName(objeto.categoryId),
        }))
      )
    );
    return listaModificada$;
  }
  async transformarDatosSubSubCategoriaString() {
    const listaActual$: Observable<SubSubCategoriaModel[]> = this.subsubcategorias$;
    const listaModificada$: Observable<SubSubCategoriaModelString[]> = listaActual$.pipe(
      map((objetos: SubSubCategoriaModel[]) =>
        objetos.map((objeto: SubSubCategoriaModel) => ({
          subSubCategoriaId: objeto.subSubCategoriaId,
          nameSubSubCategoria: objeto.nameSubSubCategoria,
          subCategoriaId: objeto.subCategoriaId,
          subCategoriaIdString: this.getSubCategoriaName(objeto.subCategoriaId),
        }))
      )
    );
    return listaModificada$;
  }

}
