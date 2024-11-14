export enum ComboStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    OUT_OF_STOCK = 'OUT_OF_STOCK'
}

export interface ComboOverview {
    id: string;
    image: string;
    sku: string;
    name: string;
    description: string,
    status: ComboStatus;
    prices: {
        price: number;
    }
}