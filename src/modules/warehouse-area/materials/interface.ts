export enum WarehouseAreaMaterialStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface WarehouseAreaMaterialOverview {
    id: number;
    quantity: number;
    quantityAvailable: number;
    expiryDate: Date;
    status: WarehouseAreaMaterialStatus;
    storageArea: {
        id: number;
        code: string;
        name: string;
        description: string;
    }
    material: {
        id: number;
        sku: string;
        name: string;
        packing: string;
        unit: string;
        weight: number;
    }
}