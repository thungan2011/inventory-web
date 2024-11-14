export enum WarehouseAreaProductStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface WarehouseAreaProductOverview {
    quantity: number;
    storageArea: {
        code: string;
        name: string;
        description: string;
    }
    product: {
        sku: string;
        name: string;
        packing: string;
    }
}