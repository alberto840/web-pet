export class getVacunaHorarios {
    static readonly type = '[VacunaHorario] Get VacunaHorarios';
}

export class addVacunaHorario {
    static readonly type = '[VacunaHorario] Add VacunaHorario';
    constructor(public payload: any) {}
}

export class updateVacunaHorario {
    static readonly type = '[VacunaHorario] Update VacunaHorario';
    constructor(public payload: any) {}
}

export class deleteVacunaHorario {
    static readonly type = '[VacunaHorario] Delete VacunaHorario';
    constructor(public id: number) {}
}