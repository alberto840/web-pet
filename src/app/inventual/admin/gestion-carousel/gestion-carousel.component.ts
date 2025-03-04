import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CarouselModel } from '../../models/carousel.model';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { CarritoService } from '../../services/carrito.service';
import { AddCarousel, getCarousel } from '../../state-management/carousel/carousel.action';
import { CarouselState } from '../../state-management/carousel/carousel.state';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-gestion-carousel',
  templateUrl: './gestion-carousel.component.html',
  styleUrls: ['./gestion-carousel.component.scss']
})
export class GestionCarouselComponent implements OnInit, AfterViewInit {
  isLoading$: Observable<boolean> = inject(Store).select(CarouselState.isLoading);
  file: File | null = null;
  @ViewChild('imageContainer') imageContainer!: ElementRef<HTMLDivElement>;
  selectedItemCount: number = 0;
  carousel$: Observable<CarouselModel[]>;
  carouselItems: CarouselModel[] = [];
  carousel: CarouselModel = {
    id: 0,
    url: ''
  }

  constructor(public carritoService: CarritoService, private store: Store, private _snackBar: MatSnackBar) {
    this.carousel$ = this.store.select(CarouselState.getItems);
  }

  ngOnInit(): void {
    this.store.dispatch([new getCarousel()]);
    this.carousel$.subscribe((carousel) => {
      this.carouselItems = carousel;
      this.dataSource.data = carousel;
    });
  }

  postearImagen() {
    if (!this.file) {
      this.openSnackBar('Error en el registro, no se pudo cargar la imagen', 'Cerrar');
      return;
    }
    this.store.dispatch(new AddCarousel(this.file)).subscribe({
      next: () => {
        console.log('Imagen agregada exitosamente');
        this.openSnackBar('Imagen agregada correctamente', 'Cerrar');
        this.file = null;
        this.selectedItemCount = 0;
        this.imageContainer.nativeElement.innerHTML = '';
      },
      error: (error) => {
        console.error('Error al agregar Imagen:', error);
        this.openSnackBar('La Imagen no se pudo agregar', 'Cerrar');
      }
    });
  }

  // Sidebar menu activation
  menuSidebarActive: boolean = false;
  toggleSidebar() {
    this.menuSidebarActive = !this.menuSidebarActive;
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

  checkboxLabel(row?: CarouselModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  myfunction() {
    this.menuSidebarActive = !this.menuSidebarActive;
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
  
  handleFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      this.file = files[0];
      this.selectedItemCount += files.length;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = () => {
          const imgContainer = document.createElement('div');
          imgContainer.classList.add('image-container');

          const img = document.createElement('img');
          img.src = reader.result as string;
          img.classList.add('uploaded-item', 'h-[60px]');

          const deleteIcon = document.createElement('span');
          deleteIcon.classList.add('delete-icon');
          deleteIcon.innerHTML = '<i class="fas fa-trash-alt"></i>';
          deleteIcon.onclick = () => {
            imgContainer.remove();
            this.selectedItemCount--;
          };

          imgContainer.appendChild(img);
          imgContainer.appendChild(deleteIcon);

          this.imageContainer.nativeElement.appendChild(imgContainer);
        };
        // Read the file as a data URL
        reader.readAsDataURL(file);
      }
    }
  }

  // Table configuration
  displayedColumns: string[] = ['select', 'url'];
  dataSource: MatTableDataSource<CarouselModel> = new MatTableDataSource();
  selection = new SelectionModel<CarouselModel>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


}
