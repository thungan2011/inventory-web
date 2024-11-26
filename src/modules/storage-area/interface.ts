export enum StorageAreaStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export enum StorageAreaType {
    PRODUCT = 'PRODUCT',
    MATERIAL = 'MATERIAL',
}

export interface StorageAreaOverview {
    id: number;
    code: string;
    name: string;
    description: string;
    status: StorageAreaStatus;
    type: StorageAreaType;
}

export interface StorageAreaDetail extends StorageAreaOverview {
    productStorageHistories: {
        expiryDate: Date;
        quantity: number;
        quantityAvailable: number;
        product: {
            sku: string;
            name: string;
            weight: number;
            unit: string;
            packing: string;
        }
    } []
}