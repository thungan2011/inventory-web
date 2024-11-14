export enum StockMaterialStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    OUT_OF_STOCK = 'OUT_OF_STOCK'
}

export interface StockMaterialOverview {
    id: string;
    sku: string;
    name: string;
    unit: string;
    weight: number;
    packing: string;
    quantity_availabel: number;
    status: StockMaterialStatus;
}