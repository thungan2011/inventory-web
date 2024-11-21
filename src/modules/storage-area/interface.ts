export enum StorageAreaStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface StorageAreaOverview {
    id: number;
    code: string;
    name: string;
    description: string;
    status: StorageAreaStatus;
}

export interface StorageAreaDetail extends StorageAreaOverview {
    productStorageHistories: {
        expiryDate: Date;
        quantity: number;
        quantityAvailable: number;
        product: {
            sku: string;
            name: string;
        }
    } []
}