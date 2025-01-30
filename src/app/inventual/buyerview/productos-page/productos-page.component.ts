import { Component, inject, OnInit } from '@angular/core';
import { ProductoModel } from '../../models/producto.model';
import { Observable } from 'rxjs';
import { ProductoState } from '../../state-management/producto/producto.state';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { GetProducto } from '../../state-management/producto/producto.action';

@Component({
  selector: 'app-productos-page',
  templateUrl: './productos-page.component.html',
  styleUrls: ['./productos-page.component.scss']
})
export class ProductosPageComponent implements OnInit {
  isLoading$: Observable<boolean> = inject(Store).select(ProductoState.isLoading);
  productos: ProductoModel[] = [];
  productos$: Observable<ProductoModel[]>;

  menuSidebarActive:boolean=false;
  constructor(public router: Router, private store: Store){
    this.productos$ = this.store.select(ProductoState.getProductos);
  }
  ngOnInit(): void {
      this.store.dispatch([new GetProducto()]);   
  }
  myfunction(){
    if(this.menuSidebarActive==false){
      this.menuSidebarActive=true;
    }
    else {
      this.menuSidebarActive=false;
    }
  }

}
