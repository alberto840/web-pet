import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ProductoModel, ServicioModel } from '../../models/producto.model';
import { AddServicioToCarrito, AddProductoToCarrito, RemoveServicioFromCarrito, RemoveProductoFromCarrito, VaciarCarrito, UpdateCantidadServicio, UpdateCantidadProducto } from './carrito.action';

export interface CarritoStateModel {
  servicios: ServicioModel[]; // Lista de servicios en el carrito
  productos: ProductoModel[]; // Lista de productos en el carrito
}@State<CarritoStateModel>({
  name: 'carrito',
  defaults: {
    servicios: [],
    productos: [],
  },
})
@Injectable()
export class CarritoState {
  @Selector()
  static getServicios(state: CarritoStateModel) {
    return state.servicios;
  }

  @Selector()
  static getProductos(state: CarritoStateModel) {
    return state.productos;
  }

  @Selector()
  static getCantidadTotal(state: CarritoStateModel) {
    const serviciosTotal = state.servicios.reduce((total, servicio) => total + (servicio.cantidad || 0), 0);
    const productosTotal = state.productos.reduce((total, producto) => total + (producto.cantidad || 0), 0);
    return serviciosTotal + productosTotal;
  }

  @Selector()
  static getTotal(state: CarritoStateModel) {
    const totalServicios = state.servicios.reduce((total, servicio) => total + servicio.price * (servicio.cantidad || 1), 0);
    const totalProductos = state.productos.reduce((total, producto) => total + producto.price * (producto.cantidad || 1), 0);
    return totalServicios + totalProductos;
  }

  @Action(AddServicioToCarrito)
  addServicioToCarrito({ getState, patchState }: StateContext<CarritoStateModel>, { payload }: AddServicioToCarrito) {
    const state = getState();
    const servicioIndex = state.servicios.findIndex((servicio) => servicio.serviceId === payload.serviceId);

    if (servicioIndex === -1) {
      // Si el servicio no está en el carrito, agrégalo con cantidad 1
      patchState({ servicios: [...state.servicios, { ...payload, cantidad: 1 }] });
    }
  }

  @Action(AddProductoToCarrito)
  addProductoToCarrito({ getState, patchState }: StateContext<CarritoStateModel>, { payload }: AddProductoToCarrito) {
    const state = getState();
    const productoIndex = state.productos.findIndex((producto) => producto.productId === payload.productId);

    if (productoIndex === -1) {
      // Si el producto no está en el carrito, agrégalo con cantidad 1
      patchState({ productos: [...state.productos, { ...payload, cantidad: 1 }] });
    }
  }

  @Action(UpdateCantidadServicio)
  updateCantidadServicio(
    { getState, patchState }: StateContext<CarritoStateModel>,
    { serviceId, cantidad }: UpdateCantidadServicio
  ) {
    const state = getState();
    const servicios = state.servicios.map((servicio) =>
      servicio.serviceId === serviceId ? { ...servicio, cantidad } : servicio
    );
    patchState({ servicios });
  }

  @Action(UpdateCantidadProducto)
  updateCantidadProducto(
    { getState, patchState }: StateContext<CarritoStateModel>,
    { productId, cantidad }: UpdateCantidadProducto
  ) {
    const state = getState();
    const productos = state.productos.map((producto) =>
      producto.productId === productId ? { ...producto, cantidad } : producto
    );
    patchState({ productos });
  }

  @Action(RemoveServicioFromCarrito)
  removeServicioFromCarrito({ getState, patchState }: StateContext<CarritoStateModel>, { serviceId }: RemoveServicioFromCarrito) {
    const state = getState();
    const servicios = state.servicios.filter((servicio) => servicio.serviceId !== serviceId);
    patchState({ servicios });
  }

  @Action(RemoveProductoFromCarrito)
  removeProductoFromCarrito({ getState, patchState }: StateContext<CarritoStateModel>, { productId }: RemoveProductoFromCarrito) {
    const state = getState();
    const productos = state.productos.filter((producto) => producto.productId !== productId);
    patchState({ productos });
  }

  @Action(VaciarCarrito)
  vaciarCarrito({ patchState }: StateContext<CarritoStateModel>) {
    patchState({
      servicios: [],
      productos: [],
    });
  }
}