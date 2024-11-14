export enum MaterialStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    OUT_OF_STOCK = 'OUT_OF_STOCK'
}

export interface MaterialOverview {
    id: number;
    sku: string;
    name: string;
    unit: string;
    weight: number;
    origin: string;
    packing: string;
    quantityAvailable: number;
    maximumStockLevel: number;
    minimumStockLevel: number;
    status: MaterialStatus;
    note: string;
}

export interface MaterialDetail extends MaterialOverview {
    categories: {
        id: number;
        name: string;
    } [];
    providers: {
        id: number;
        name: string;
        website: string;
        address: string;
        city: string;
        ward: string;
        district: string;
        email: string;
        phone: string;
        representativeName: string;
        representativePhone: string;
        representativeEmail: string;
    } []
}