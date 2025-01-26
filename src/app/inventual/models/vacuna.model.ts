export interface VacunaModel {
    vaccinationId: number;
    name: string;
}

export interface HorarioVacunaModel {
    vaccinationScheduleId: number;
    dateVaccination: Date;
    status:          string;
    createdAt:       Date;
    petId:           number;
    vaccinationId:   number;
}
