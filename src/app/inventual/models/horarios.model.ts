import { ServicioModel } from "./producto.model";

export interface HorarioAtencionModel {
    availabilityId: number;
    serviceId: number;
    isReserved: boolean;
    availableHour: string;
}

export interface HorarioAtencionModelString {
    availabilityId: number;
    serviceId: number;
    isReserved: boolean;
    availableHour: string;
    service: ServicioModel;
}
