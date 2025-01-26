export class GetSetting {
    static readonly type = '[Setting] Get Setting';
}

export class AddSetting {
    static readonly type = '[Setting] Add Setting';
    constructor(public payload: any) {}
}

export class UpdateSetting {
    static readonly type = '[Setting] Update Setting';
    constructor(public payload: any) {}
}

export class DeleteSetting {
    static readonly type = '[Setting] Delete Setting';
    constructor(public id: number) {}
}