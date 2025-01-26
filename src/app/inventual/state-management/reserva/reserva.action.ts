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