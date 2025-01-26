export class GetNotificacionMasiva {
    static readonly type = '[NotificacionMasiva] Get NotificacionMasiva';
}

export class AddNotificacionMasiva {
    static readonly type = '[NotificacionMasiva] Add NotificacionMasiva';
    constructor(public payload: any) {}
}

export class UpdateNotificacionMasiva {
    static readonly type = '[NotificacionMasiva] Update NotificacionMasiva';
    constructor(public payload: any) {}
}

export class DeleteNotificacionMasiva {
    static readonly type = '[NotificacionMasiva] Delete NotificacionMasiva';
    constructor(public id: number) {}
}