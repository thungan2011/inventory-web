export enum ProductStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    OUT_OF_STOCK = 'OUT_OF_STOCK'
}

export interface ProductOverview {
    id: number;
    image?: string;
    sku: string;
    name: string;
    origin?: string;
    price?: number;
    unit: string;
    packing: string;
    weight: number;
    quantityAvailable: number;
    minimumStockLevel?: number;
    maximumStockLevel?: number;
    description?: string;
    usageTime: string;
    status: ProductStatus;
    prices: {
        price: number;
    }[]
}

export interface ProductDetail extends ProductOverview {
    categories: {
        id: number;
        name: string;
    } []
    prices: {
        price: number;
    }[]
}