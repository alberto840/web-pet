export class getActividad {
    static readonly type = '[Actividad] Get Actividad';
}

export class AddActividad {
    static readonly type = '[Actividad] Add Actividad';
    constructor(public payload: any) {}
}

export class UpdateActividad {
    static readonly type = '[Actividad] Update Actividad';
    constructor(public payload: any) {}
}

export class DeleteActividad {
    static readonly type = '[Actividad] Delete Actividad';
    constructor(public id: number) {}
}