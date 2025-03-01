export interface CodigoDescuentoModel {
    promoId?:       number;
    code:          string;
    description:   string;
    discountType:  string;
    discountValue: number;
    maxUses:       number;
    startDate:     Date;
    endDate:       Date;
    active:        boolean;
    providerId:    number;
    createdAt?:     Date;
    currentUses?:  number;
}

export interface CodigoDescuentoModelString {
    promoId?:       number;
    code:          string;
    description:   string;
    discountType:  string;
    discountValue: number;
    maxUses:       number;
    startDate:     Date;
    endDate:       Date;
    active:        boolean;
    providerId:    number;
    providerIdstring:    string;
    createdAt?:     Date;
    currentUses?:  number;
}

export interface OfertaModel {
    offerId?:       number;
    name:          string;
    description:   string;
    discountType:  string;
    discountValue: number;
    active:        boolean;
    startDate?:     Date;
    endDate?:       Date;
}

export interface ProductoModel {
    productId?:   number;
    name:        string;
    description: string;
    price:       number;
    stock:       number;
    createdAt?:   Date;
    status:      boolean;
    providerId:  number;
    categoryId:  number;
    imageUrl?:    string;
    cantidad?:    number;
}

export interface ServicioModel {
    serviceId?:   number;
    serviceName: string;
    price:       number;
    duration:    number;
    description: string;
    status:      boolean;
    providerId:  number;
    createdAt?: Date;
    imageId:     null;
    imageUrl?:    string;
    cantidad?:    number;
    tipoAtencion: string;
}

export interface ProductoModelString {
    productId?:   number;
    name:        string;
    description: string;
    price:       number;
    stock:       number;
    createdAt?:   Date;
    status:      boolean;
    providerId:  number;
    categoryId:  number;
    providerIdstring:  string;
    categoryIdstring:  string;
    imageUrl?:    string;
    cantidad?:    number;
}

export interface ServicioModelString {
    serviceId?:   number;
    serviceName: string;
    price:       number;
    duration:    number;
    description: string;
    status:      boolean;
    providerId:  number;
    providerIdstring?:  string;
    categoryIdstring:  string;
    createdAt?: Date;
    imageId:     null;
    imageUrl?:    string;
    cantidad?:    number;
    tipoAtencion: string;
}

export interface TransaccionModel {
    transactionHistoryId?: number;
    totalAmount: number;
    status:      string;
    userId:      number;
    serviceId?:   number;
    productId?:   number;
    createdAt?:   Date;
}

export interface OfertaProductoModel {
    offersProductsId: number;
    offerId:   number;
    productId: number;
}

export interface OfertaServicioModel {
    offersServicesId: number;
    serviceId: number;
    offerId:   number;
}

export interface OfertaProductoModelString {
    offersProductsId: number;
    offerId:   number;
    productId: number;
    offerIdstring:   string;
    productIdstring: string;
}

export interface OfertaServicioModelString {
    offersServicesId: number;
    serviceId: number;
    offerId:   number;
    serviceIdstring: string;
    offerIdstring:   string;
}

export interface ReservacionModel {
    reservationId?: number;
    userId:    number;
    serviceId: number;
    date:      Date;
    status:    string;
    availabilityId: number;
    petId:    number;
}
