export class getVacuna {
    static readonly type = '[Vacuna] Get Vacuna';
}

export class addVacuna {
    static readonly type = '[Vacuna] Add Vacuna';
    constructor(public payload: any) {}
}

export class updateVacuna {
    static readonly type = '[Vacuna] Update Vacuna';
    constructor(public payload: any) {}
}

export class deleteVacuna {
    static readonly type = '[Vacuna] Delete Vacuna';
    constructor(public id: number) {}
}