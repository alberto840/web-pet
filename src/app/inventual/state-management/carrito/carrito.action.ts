import { ServicioModel, ProductoModel } from '../../models/producto.model';

export class AddServicioToCarrito {
  static readonly type = '[Carrito] Add Servicio';
  constructor(public payload: ServicioModel) {}
}

export class AddProductoToCarrito {
  static readonly type = '[Carrito] Add Producto';
  constructor(public payload: ProductoModel) {}
}

export class RemoveServicioFromCarrito {
  static readonly type = '[Carrito] Remove Servicio';
  constructor(public serviceId: number) {}
}

export class RemoveProductoFromCarrito {
  static readonly type = '[Carrito] Remove Producto';
  constructor(public productId: number) {}
}

export class VaciarCarrito {
  static readonly type = '[Carrito] Vaciar';
}

export class UpdateCantidadServicio {
  static readonly type = '[Carrito] Update Cantidad Servicio';
  constructor(public serviceId: number, public cantidad: number) {}
}

export class UpdateCantidadProducto {
  static readonly type = '[Carrito] Update Cantidad Producto';
  constructor(public productId: number, public cantidad: number) {}
}