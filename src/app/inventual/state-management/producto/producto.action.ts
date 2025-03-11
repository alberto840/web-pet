import { ProductoModel } from "../../models/producto.model";

export class GetProducto {
    static readonly type = '[Producto] Get Producto';
}

export class AddProducto {
    static readonly type = '[Producto] Add Producto';
    constructor(public payload: any, public img: any) {}
}

export class AddProductoByProvider {
    static readonly type = '[Producto] Add Producto By Provider';
    constructor(public payload: ProductoModel) {}
}

export class UpdateProducto {
    static readonly type = '[Producto] Update Producto';
    constructor(public payload: any, public img: any) {}
}

export class DeleteProducto {
    static readonly type = '[Producto] Delete Producto';
    constructor(public id: number) {}
}

export class GetProductoById {
    static readonly type = '[Producto] Get Producto By Id';
    constructor(public id: number) {}
}

export class GetProductosByProvider {
    static readonly type = '[Producto] Get Productos By Provider';
    constructor(public providerId: number) {}
}

export class GetNewProductos {
    static readonly type = '[Producto] Get New Productos';
}

export class GetOfferProductos {
    static readonly type = '[Producto] Get Offer Productos';
}