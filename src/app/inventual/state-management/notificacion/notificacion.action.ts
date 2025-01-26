export class GetNotificacion {
    static readonly type = '[Notificacion] Get Notificacion';
}

export class AddNotificacion {
    static readonly type = '[Notificacion] Add Notificacion';
    constructor(public payload: any) {}
}

export class UpdateNotificacion {
    static readonly type = '[Notificacion] Update Notificacion';
    constructor(public payload: any) {}
}

export class DeleteNotificacion {
    static readonly type = '[Notificacion] Delete Notificacion';
    constructor(public id: number) {}
}