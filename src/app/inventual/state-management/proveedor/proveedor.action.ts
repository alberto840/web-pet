import { EspecialidadModel } from "../../models/especialidad.model";
import { EspecialidadProveedorModel } from "../../models/proveedor.model";

export class GetProveedor {
    static readonly type = '[Proveedor] Get Proveedor';
}

export class AddProveedor {
    static readonly type = '[Proveedor] Add Proveedor';
    constructor(public payload: any, public img: any, public especialidad: EspecialidadProveedorModel) {}
}

export class UpdateProveedor {
    static readonly type = '[Proveedor] Update Proveedor';
    constructor(public payload: any, public img: any) {}
}

export class DeleteProveedor {
    static readonly type = '[Proveedor] Delete Proveedor';
    constructor(public id: number) {}
}

export class GetProveedorById {
    static readonly type = '[Proveedor] Get Proveedor By Id';
    constructor(public id: number) {}
}