export interface ActividadesModel {
    activityLogsId?: number;
    userId:        number;
    action:      string;
    description: string;
    ip:          string;
    createdAt:   Date;
}

export interface ActividadesModelString {
    activityLogsId?: number;
    userId:        number;
    action:      string;
    description: string;
    ip:          string;
    createdAt:   Date;
    userIdstring:        string;
    createdAtstring:   string;
}