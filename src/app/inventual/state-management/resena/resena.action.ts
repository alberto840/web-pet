export class GetResena {
    static readonly type = '[Resena] Get Resena';
}

export class AddResena {
    static readonly type = '[Resena] Add Resena';
    constructor(public payload: any) {}
}

export class UpdateResena {
    static readonly type = '[Resena] Update Resena';
    constructor(public payload: any) {}
}

export class DeleteResena {
    static readonly type = '[Resena] Delete Resena';
    constructor(public id: number) {}
}