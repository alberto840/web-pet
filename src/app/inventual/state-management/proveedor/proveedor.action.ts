export class GetProveedor {
    static readonly type = '[Proveedor] Get Proveedor';
}

export class AddProveedor {
    static readonly type = '[Proveedor] Add Proveedor';
    constructor(public payload: any) {}
}

export class UpdateProveedor {
    static readonly type = '[Proveedor] Update Proveedor';
    constructor(public payload: any) {}
}

export class DeleteProveedor {
    static readonly type = '[Proveedor] Delete Proveedor';
    constructor(public id: number) {}
}