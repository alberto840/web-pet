export class GetTicket {
    static readonly type = '[Ticket] Get Ticket';
}

export class AddTicket {
    static readonly type = '[Ticket] Add Ticket';
    constructor(public payload: any) {}
}

export class UpdateTicket {
    static readonly type = '[Ticket] Update Ticket';
    constructor(public payload: any) {}
}

export class DeleteTicket {
    static readonly type = '[Ticket] Delete Ticket';
    constructor(public id: number) {}
}