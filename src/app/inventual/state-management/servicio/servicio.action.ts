import { ServicioModel } from "../../models/producto.model";

export class GetServicio {
    static readonly type = '[Servicio] Get Servicio';
}

export class AddServicio {
    static readonly type = '[Servicio] Add Servicio';
    constructor(public payload: any, public img: any, public horarios: string[]) {}
}

export class AddServicioByProvider {
    static readonly type = '[Servicio] Add Servicio By Provider';
    constructor(public payload: ServicioModel) {}
}

export class UpdateServicio {
    static readonly type = '[Servicio] Update Servicio';
    constructor(public payload: any, public img: any) {}
}

export class DeleteServicio {
    static readonly type = '[Servicio] Delete Servicio';
    constructor(public id: number) {}
}

export class GetServicioById {
    static readonly type = '[Servicio] Get Servicio By Id';
    constructor(public id: number) {}
}

export class GetServiciosByProvider {
    static readonly type = '[Servicio] Get Servicios By Provider';
    constructor(public providerId: number) {}
}

export class GetNewServicios {
    static readonly type = '[Servicio] Get New Servicios';
}

export class GetOfferServicios {
    static readonly type = '[Servicio] Get Offer Servicios';
}