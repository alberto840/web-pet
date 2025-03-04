export interface ProveedorModel {
    providerId?: number;
    name: string;
    description: string;
    address: string;
    userId: number;
    rating: number;
    status: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    productCount?: number;
    serviceCount?: number;
    imageUrl?: string;
    reviews?: number;
}

export interface ProveedorModelString {
    providerId?: number;
    name: string;
    description: string;
    address: string;
    userId: number;
    userIdstring: string;
    rating: number;
    status: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    createdAtstring?: string;
    updatedAtstring?: string;
    productCount?: number;
    serviceCount?: number;
    imageUrl?: string;
    reviews?: number;
}

export interface EspecialidadProveedorModel {
    idSpProvider?: number;
    specialtyId: number;
    providerId:  number;
}

export interface ResenaModel {
    reviewsId?:  number;
    rating:     number;
    comment:    string;
    createdAt?: Date;
    userId:     number;
    providerId: number;
}

export interface ResenaModelString {
    reviewsId?:  number;
    rating:     number;
    comment:    string;
    userId:     number;
    providerId: number;
    createdAt?: Date;
    createdAtstring?: string;
    userIdstring:     string;
    providerIdstring: string;
}

