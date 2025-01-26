export class GetHistorialMedico {
    static readonly type = '[HistorialMedico] Get HistorialMedico';
}

export class AddHistorialMedico {
    static readonly type = '[HistorialMedico] Add HistorialMedico';
    constructor(public payload: any) {}
}

export class UpdateHistorialMedico {
    static readonly type = '[HistorialMedico] Update HistorialMedico';
    constructor(public payload: any) {}
}

export class DeleteHistorialMedico {
    static readonly type = '[HistorialMedico] Delete HistorialMedico';
    constructor(public id: number) {}
}