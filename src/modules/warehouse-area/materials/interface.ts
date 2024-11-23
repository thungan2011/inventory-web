export enum WarehouseAreaMaterialStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface WarehouseAreaMaterialOverview {
    quantity: number;
    expiryDate: Date;
    status: WarehouseAreaMaterialStatus;
    storageArea: {
        code: string;
        name: string;
        description: string;
    }
    material: {
        sku: string;
        name: string;
        packing: string;
        unit: string;
        weight: number;
    }
}