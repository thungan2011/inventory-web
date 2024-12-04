export enum WarehouseAreaProductStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface WarehouseAreaProductOverview {
    id: number;
    quantity: number;
    quantityAvailable: number;
    expiryDate: Date;
    status: WarehouseAreaProductStatus;
    storageArea: {
        id: number;
        code: string;
        name: string;
        description: string;
    }
    product: {
        sku: string;
        name: string;
        packing: string;
        unit: string;
        weight: number;
    }
}