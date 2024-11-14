export enum ProductPriceStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface ProductPriceOverview {
    id: number;
    price: number;
    dateStart: Date;
    dateEnd: Date;
    status: ProductPriceStatus;
    product:{
        sku: string;
        name: string;
        weight: number;
        packing: string;
        unit: string;
    }
}