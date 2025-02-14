export class getHorarioAtencion {
    static readonly type = '[HorarioAtencion] Get HorarioAtencion';
    constructor(public serviceId: any) {}
}
export class AddHorarioAtencion{
    static readonly type = '[HorarioAtencion] Add HorarioAtencion';
    constructor(public payload: any, public serviceId: any) {}
}
export class UpdateHorarioAtencion {
    static readonly type = '[HorarioAtencion] Update HorarioAtencion';
    constructor(public payload: any) {}
}
export class DeleteHorarioAtencion {
    static readonly type = '[HorarioAtencion] Delete HorarioAtencion';
    constructor(public id: number) {}
}