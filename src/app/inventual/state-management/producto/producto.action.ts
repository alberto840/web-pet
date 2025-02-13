export class GetProducto {
    static readonly type = '[Producto] Get Producto';
}

export class AddProducto {
    static readonly type = '[Producto] Add Producto';
    constructor(public payload: any, public img: any) {}
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