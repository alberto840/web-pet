import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { ServicioModel, ProductoModel } from '../models/producto.model';
import { AddServicioToCarrito, AddProductoToCarrito, RemoveServicioFromCarrito, RemoveProductoFromCarrito, VaciarCarrito, UpdateCantidadServicio, UpdateCantidadProducto } from '../state-management/carrito/carrito.action';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  constructor(private store: Store) {}

  agregarServicioAlCarrito(servicio: ServicioModel) {
    this.store.dispatch(new AddServicioToCarrito(servicio));
  }

  agregarProductoAlCarrito(producto: ProductoModel) {
    this.store.dispatch(new AddProductoToCarrito(producto));
  }

  eliminarServicioDelCarrito(serviceId: number) {
    this.store.dispatch(new RemoveServicioFromCarrito(serviceId));
  }

  eliminarProductoDelCarrito(productId: number) {
    this.store.dispatch(new RemoveProductoFromCarrito(productId));
  }

  actualizarCantidadServicio(serviceId: number, cantidad: number) {
    this.store.dispatch(new UpdateCantidadServicio(serviceId, cantidad));
  }

  actualizarCantidadProducto(productId: number, cantidad: number) {
    this.store.dispatch(new UpdateCantidadProducto(productId, cantidad));
  }

  vaciarCarrito() {
    this.store.dispatch(new VaciarCarrito());
  }

  obtenerTotalProductos(productos: ProductoModel[]) {
    return productos.reduce((acc, producto) => acc + producto.price * (producto.cantidad ?? 1), 0);
  }

  obtenerTotalServicios(servicios: ServicioModel[]) {
    return servicios.reduce((acc, servicio) => acc + servicio.price * (servicio.cantidad ?? 1), 0);
  }

  obtenerCantidadTotalProductos(productos: ProductoModel[]) {
    return productos.reduce((acc, producto) => acc + (producto.cantidad ?? 1), 0);
  }

  obtenerCantidadTotalServicios(servicios: ServicioModel[]) {
    return servicios.reduce((acc, servicio) => acc + (servicio.cantidad ?? 1), 0);
  }
}