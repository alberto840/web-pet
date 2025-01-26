export interface NotificacionCreacionModel {
    email:      string;
    sellerName: string;
}

export interface NotificacionModel {
    notificationId:   number;
    message:          string;
    notificationType: string;
    isRead:           boolean;
    userId:           number;
}

export interface NotificacionMasivaModel {
    userIds:          number[];
    message:          string;
    notificationType: string;
}