import { ProductoModel, ServicioModel } from "./producto.model";

export interface CarritoModel {
    servicios: ServicioModel[];
    productos: ProductoModel[];
  }