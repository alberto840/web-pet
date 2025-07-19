import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { map, Observable, startWith, switchMap } from 'rxjs';
import { CategoriaModel, SubCategoriaModel, SubSubCategoriaModel } from 'src/app/inventual/models/categoria.model';
import { ProductoModel } from 'src/app/inventual/models/producto.model';
import { ProveedorModel } from 'src/app/inventual/models/proveedor.model';
import { getCategorias } from 'src/app/inventual/state-management/categoria/categoria.action';
import { CategoriaState } from 'src/app/inventual/state-management/categoria/categoria.state';
import { AddProducto, GetProducto } from 'src/app/inventual/state-management/producto/producto.action';
import { ProductoState } from 'src/app/inventual/state-management/producto/producto.state';
import { GetProveedor } from 'src/app/inventual/state-management/proveedor/proveedor.action';
import { ProveedorState } from 'src/app/inventual/state-management/proveedor/proveedor.state';
import { GetSubcategoria } from 'src/app/inventual/state-management/subcategoria/subcategoria.action';
import { SubcategoriaState } from 'src/app/inventual/state-management/subcategoria/subcategoria.state';
import { GetSubsubcategoria } from 'src/app/inventual/state-management/subsubcategoria/subsubcategoria.action';
import { SubsubcategoriaState } from 'src/app/inventual/state-management/subsubcategoria/subsubcategoria.state';
import { ConvertirRutaAImagenService } from 'src/app/inventual/utils/convertir-ruta-aimagen.service';
import { DialogAccessService } from '../../dialog-access.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateProductComponent implements AfterViewInit, OnInit {
  providerId: string = localStorage.getItem('providerId') || '';
  isLoading$: Observable<boolean> = inject(Store).select(CategoriaState.isLoading);
  isLoadingProducto$: Observable<boolean> = inject(Store).select(ProductoState.isLoading);
  subCatIsLoading$: Observable<boolean> = inject(Store).select(SubcategoriaState.isLoading);
  subSubCatIsLoading$: Observable<boolean> = inject(Store).select(SubsubcategoriaState.isLoading);
  proveedorIsLoading$: Observable<boolean> = inject(Store).select(ProveedorState.isLoading);

  filteredProveedor!: Observable<ProveedorModel[]>;
  filteredCategoria!: Observable<CategoriaModel[]>;
  filteredSubCategoria!: Observable<SubCategoriaModel[]>;
  filteredSubSubCategoria!: Observable<SubSubCategoriaModel[]>;

  categorias$: Observable<CategoriaModel[]>;
  subcategorias$: Observable<SubCategoriaModel[]>;
  subsubcategorias$: Observable<SubSubCategoriaModel[]>;
  proveedores$: Observable<ProveedorModel[]>;

  categories: CategoriaModel[] = [];
  subcategories: SubCategoriaModel[] = [];
  subsubcategories: SubSubCategoriaModel[] = [];
  proveedores: ProveedorModel[] = [];

  myControlCategorias = new FormControl('');
  myControlSubCategorias = new FormControl('');
  myControlSubSubCategorias = new FormControl('');
  myControlProveedores = new FormControl('');

  file: File | null = null;

  userId: string = localStorage.getItem('userId') || '';
  @ViewChild('imageContainer') imageContainer!: ElementRef<HTMLDivElement>;
  selectedItemCount: number = 0;
  checked = false;

  proveedor: ProveedorModel = {
    providerId: 0,
    name: '',
    description: '',
    address: '',
    userId: this.userId ? parseInt(this.userId) : 0,
    rating: 0,
    status: true,
    verified: false,
    phone: ''
  }
  categoria: CategoriaModel = {
    categoryId: 0,
    nameCategory: '',
    icono: ''
  }
  subcategoria: SubCategoriaModel = {
    subCategoriaId: 0,
    nameSubCategoria: '',
    categoryId: 0
  }
  subsubcategoria: SubSubCategoriaModel = {
    subSubCategoriaId: 0,
    nameSubSubCategoria: '',
    subCategoriaId: 0
  }
  producto: ProductoModel = {
    productId: 0,
    name: '',
    description: '',
    price: 0,
    stock: 0,
    status: true,
    providerId: 0,
    categoryId: 0,
    isOnSale: false
  }

  constructor(private cdr: ChangeDetectorRef,private utils: ConvertirRutaAImagenService, private router: Router, private _snackBar: MatSnackBar, private store: Store, public dialogService: DialogAccessService, private dialogRef: MatDialogRef<CreateProductComponent>) {
    this.categorias$ = this.store.select(CategoriaState.getCategorias);
    this.subcategorias$ = this.store.select(SubcategoriaState.getSubcategorias);
    this.subsubcategorias$ = this.store.select(SubsubcategoriaState.getSubsubcategorias);
    this.proveedores$ = this.store.select(ProveedorState.getProveedores);
  }
  ngAfterViewInit(): void {
    this.cdr.detectChanges(); // Forzar la detección de cambios
  }
  ngOnInit(): void {
    this.store.dispatch([new getCategorias(), new GetSubcategoria(), new GetSubsubcategoria(), new GetProveedor()]);

    this.filteredProveedor = this.myControlProveedores.valueChanges.pipe(
      startWith(''),
      switchMap(value => this._filterProveedor(value || '')),
    );
    this.filteredCategoria = this.myControlCategorias.valueChanges.pipe(
      startWith(''),
      switchMap(value => this._filterCategoria(value || ''))
    );
    this.filteredSubCategoria = this.myControlSubCategorias.valueChanges.pipe(
      startWith(''),
      switchMap(value => this._filterSubCategoria(value || '')),
    );
    this.filteredSubSubCategoria = this.myControlSubSubCategorias.valueChanges.pipe(
      startWith(''),
      switchMap(value => this._filterSubSubCategoria(value || '')),
    );
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }

  async registrarProducto() {
    this.producto.providerId = this.providerId ? parseInt(this.providerId) : 0;
    if (this.producto.name === '' || this.producto.description === '' || this.producto.price === 0 || this.producto.stock === 0) {
      this.openSnackBar('Debe llenar todos los campos', 'Cerrar');
      return;
    }

    if (this.producto.name.length < 3) {
      this.openSnackBar('El nombre de la mascota debe tener al menos 3 caracteres', 'Cerrar');
      return;
    }

    // Manejo de la imagen
    if (this.checked === false) {
      // Convertir imagen desde ruta local
      const filePath = 'assets/img/default/productsNo.png';
      try {
        this.file = await this.utils.convertImagePathToFile(filePath);
      } catch (error) {
        this.openSnackBar('Error al cargar la imagen predeterminada', 'Cerrar');
        console.error('Error al convertir la imagen:', error);
        return;
      }
    }

    // Validar que el archivo esté presente
    if (!this.file) {
      this.openSnackBar('Error en el registro, no se pudo cargar la imagen', 'Cerrar');
      return;
    }

    // Enviar usuario y archivo al store
    this.store.dispatch(new AddProducto(this.producto, this.file)).subscribe({
      next: () => {
        console.log('Producto registrado correctamente:', this.producto);
        this.openSnackBar('Producto registrado correctamente', 'Cerrar');
        this.dialogRef.close();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al registrar Producto:', error);
        this.openSnackBar('Error en el registro, vuelve a intentarlo', 'Cerrar');
      },
    });
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

  private _filterCategoria(value: string): Observable<CategoriaModel[]> {
    const filterValue = value?.toString().toLowerCase();
    return this.categorias$.pipe(
      map((categorias: CategoriaModel[]) =>
        categorias.filter(categoria => categoria.nameCategory.toLowerCase().includes(filterValue))
      )
    );
  }

  private _filterSubCategoria(value: string): Observable<SubCategoriaModel[]> {
    const filterValue = value?.toString().toLowerCase();
    return this.subcategorias$.pipe(
      map((subcategorias: SubCategoriaModel[]) =>
        subcategorias.filter(subcategorias => subcategorias.nameSubCategoria.toLowerCase().includes(filterValue))
      )
    );
  }

  private _filterSubSubCategoria(value: string): Observable<SubSubCategoriaModel[]> {
    const filterValue = value?.toString().toLowerCase();
    return this.subsubcategorias$.pipe(
      map((subsubcategorias: SubSubCategoriaModel[]) =>
        subsubcategorias.filter(subsubcategorias => subsubcategorias.nameSubSubCategoria.toLowerCase().includes(filterValue))
      )
    );
  }

  private _filterProveedor(value: string): Observable<ProveedorModel[]> {
    const filterValue = value?.toString().toLowerCase();
    return this.proveedores$.pipe(
      map((proveedores: ProveedorModel[]) =>
        proveedores.filter(proveedor => proveedor.name.toLowerCase().includes(filterValue) && proveedor.userId === parseInt(this.userId))
      )
    );
  }

  selectProveedor(proveedor: ProveedorModel) {
    this.proveedor = proveedor;
    this.producto.providerId = proveedor.providerId ?? 0;
  }

  selectCategoria(categoria: CategoriaModel) {
    this.categoria = categoria;
    this.producto.categoryId = categoria.categoryId ?? 0;
  }

  selectSubCategoria(subcategoria: SubCategoriaModel) {
    this.subcategoria = subcategoria;
  }

  selectSubSubCategoria(subsubcategoria: SubSubCategoriaModel) {
    this.subsubcategoria = subsubcategoria;
    this.producto.subSubCategoriaId = subsubcategoria.subSubCategoriaId ?? 0;
  }

  displayFnProveedor(proveedor: ProveedorModel): any {
    return proveedor && proveedor.name ? proveedor.name : "";
  }

  displayFnCategoria(categoria: CategoriaModel): any {
    return categoria && categoria.nameCategory ? categoria.nameCategory : "";
  }

  displayFnSubCategoria(subcategoria: SubCategoriaModel): any {
    return subcategoria && subcategoria.nameSubCategoria ? subcategoria.nameSubCategoria : "";
  }

  displayFnSubSubCategoria(subsubcategoria: SubSubCategoriaModel): any {
    return subsubcategoria && subsubcategoria.nameSubSubCategoria ? subsubcategoria.nameSubSubCategoria : "";
  }

  // Reiniciar formulario
  resetForm() {
    this.producto = {
      productId: 0,
      name: '',
      description: '',
      price: 0,
      stock: 0,
      createdAt: new Date(),
      status: false,
      providerId: 0,
      categoryId: 0,
      isOnSale: false
    };
    this.categoria = {
      categoryId: 0,
      nameCategory: '',
      icono: ''
    };
    this.subcategoria = {
      subCategoriaId: 0,
      nameSubCategoria: '',
      categoryId: 0
    };
    this.subsubcategoria = {
      subSubCategoriaId: 0,
      nameSubSubCategoria: '',
      subCategoriaId: 0
    };
    this.proveedor = {
      name: '',
      description: '',
      address: '',
      userId: this.userId ? parseInt(this.userId) : 0,
      rating: 0,
      status: true,
      verified: false,
      phone: ''
    };
  }
}
