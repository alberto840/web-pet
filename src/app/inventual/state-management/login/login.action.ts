export class GetLogin {
    static readonly type = '[Login] Get Login';
}

export class AddLogin {
    static readonly type = '[Login] Add Login';
    constructor(public payload: any) {}
}