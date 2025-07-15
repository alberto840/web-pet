export interface ProveedorModel {
    providerId?: number;
    userId: number; // Corresponds to `user.userId` or `user_id` if flattened
    name: string;
    description: string;
    address: string;
    imageUrl?: string; // Corresponds to `image` entity's URL
    rating: number;
    createdAt?: Date; // Corresponds to LocalDateTime
    updatedAt?: Date; // Corresponds to LocalDateTime
    status: boolean;
    reviews?: number; // Corresponds to the `reviews` field
    city?: string; // New: Corresponds to `city`
    country?: string; // New: Corresponds to `country`
    verified: boolean; // New: Corresponds to `verified`
    phone: string; // New: Corresponds to `phone`

    productCount?: number;
    serviceCount?: number;
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
    verified?: boolean;
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

