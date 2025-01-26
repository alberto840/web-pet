export class GetOfertaProducto {
    static readonly type = '[OfertaProducto] Get OfertaProducto';
}

export class AddOfertaProducto {
    static readonly type = '[OfertaProducto] Add OfertaProducto';
    constructor(public payload: any) {}
}

export class UpdateOfertaProducto {
    static readonly type = '[OfertaProducto] Update OfertaProducto';
    constructor(public payload: any) {}
}

export class DeleteOfertaProducto {
    static readonly type = '[OfertaProducto] Delete OfertaProducto';
    constructor(public id: number) {}
}