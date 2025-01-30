export interface ProveedorModel {
    providerId?: number;
    name: string;
    description: string;
    address: string;
    userId: number;
    rating: number;
    status: boolean;
}

export interface EspecialidadProveedorModel {
    idSpProvider: number;
    specialtyId: number;
    providerId:  number;
}

export interface ResenaModel {
    reviewsId:  number;
    rating:     number;
    comment:    string;
    userId:     number;
    providerId: number;
}

