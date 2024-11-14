export enum StockProductStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    OUT_OF_STOCK = 'OUT_OF_STOCK'
}

export interface StockProductOverview {
    id: string;
    sku: string;
    name: string;
    unit: string;
    weight: number;
    packing: string;
    quantity_availabel: number;
    status: StockProductStatus;
}