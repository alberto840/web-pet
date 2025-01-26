export class GetNotificacionCrear {
    static readonly type = '[NotificacionCrear] Get NotificacionCrear';
}

export class AddNotificacionCrear {
    static readonly type = '[NotificacionCrear] Add NotificacionCrear';
    constructor(public payload: any) {}
}

export class UpdateNotificacionCrear {
    static readonly type = '[NotificacionCrear] Update NotificacionCrear';
    constructor(public payload: any) {}
}

export class DeleteNotificacionCrear {
    static readonly type = '[NotificacionCrear] Delete NotificacionCrear';
    constructor(public id: number) {}
}