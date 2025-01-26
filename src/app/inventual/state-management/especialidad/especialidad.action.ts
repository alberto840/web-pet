export class GetEspecialidad {
    static readonly type = '[Especialidad] Get Especialidad';
}

export class AddEspecialidad {
    static readonly type = '[Especialidad] Add Especialidad';
    constructor(public payload: any) {}
}

export class UpdateEspecialidad {
    static readonly type = '[Especialidad] Update Especialidad';
    constructor(public payload: any) {}
}

export class DeleteEspecialidad {
    static readonly type = '[Especialidad] Delete Especialidad';
    constructor(public id: number) {}
}