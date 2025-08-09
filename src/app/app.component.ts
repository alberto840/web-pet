import { Component, Renderer2, ElementRef, OnInit } from '@angular/core';
import { ProductoModel, ServicioModel } from './inventual/models/producto.model';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'inventual';
  productosCarrito: ProductoModel[] = [];
  serviciosCarrito: ServicioModel[] = [];
  productosCarrito$: Observable<ProductoModel[]>;
  serviciosCarrito$: Observable<ServicioModel[]>;

  isRTL = false;

  isSettingsAreaActive = false;

  toggleSettingsArea() {
    this.isSettingsAreaActive = !this.isSettingsAreaActive;
  }

  constructor(private renderer: Renderer2, private el: ElementRef, private store: Store) {
    this.serviciosCarrito$ = this.store.select(state => state.carrito.servicios);
    this.productosCarrito$ = this.store.select(state => state.carrito.productos);
  }

  ngOnInit() {
    // Retrieve the direction from local storage on component initialization
    const storedDirection = localStorage.getItem('direction');
    this.isRTL = storedDirection === 'rtl';
    this.setDocumentDirection();
    this.serviciosCarrito$.subscribe((servicios) => {
      this.serviciosCarrito = servicios;
    });
    this.productosCarrito$.subscribe((productos) => {
      this.productosCarrito = productos;
    });
  }

  setDirection(direction: 'rtl' | 'ltr') {
    // Set the direction based on the parameter
    this.isRTL = direction === 'rtl';

    // Save the direction to local storage
    localStorage.setItem('direction', this.isRTL ? 'rtl' : 'ltr');

    // Apply the new direction to the document
    this.setDocumentDirection();
  }

  private setDocumentDirection() {
    const direction = this.isRTL ? 'rtl' : 'ltr';
    this.renderer.setAttribute(this.el.nativeElement.ownerDocument.documentElement, 'dir', direction);
  }

  totalQuantityCarrito() {
    let total = this.productosCarrito.length + this.serviciosCarrito.length;
    return total;
  }

}
