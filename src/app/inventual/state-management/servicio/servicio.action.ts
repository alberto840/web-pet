export class GetServicio {
    static readonly type = '[Servicio] Get Servicio';
}

export class AddServicio {
    static readonly type = '[Servicio] Add Servicio';
    constructor(public payload: any, public img: any) {}
}

export class UpdateServicio {
    static readonly type = '[Servicio] Update Servicio';
    constructor(public payload: any, public img: any) {}
}

export class DeleteServicio {
    static readonly type = '[Servicio] Delete Servicio';
    constructor(public id: number) {}
}