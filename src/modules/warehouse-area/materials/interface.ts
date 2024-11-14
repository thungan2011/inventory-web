export enum WarehouseAreaMaterialStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface WarehouseAreaMaterialOverview {

    quantity: number;
    storageArea: {
        code: string;
        name: string;
        description: string;
    }
    material: {
        sku: string;
        name: string;
        packing: string;
    }
}