export class GetReserva {
    static readonly type = '[Reserva] Get Reserva';
}

export class AddReserva {
    static readonly type = '[Reserva] Add Reserva';
    constructor(public payload: any) {}
}

export class UpdateReserva {
    static readonly type = '[Reserva] Update Reserva';
    constructor(public payload: any) {}
}

export class DeleteReserva {
    static readonly type = '[Reserva] Delete Reserva';
    constructor(public id: number) {}
}

export class GetReservasByProvider {
    static readonly type = '[Reserva] Get Reserva By Provider';
    constructor(public providerId: number) {}
}

export class GetReservasByUser {
    static readonly type = '[Reserva] Get Reserva By User';
    constructor(public userId: number) {}
}